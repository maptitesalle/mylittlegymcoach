import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import NutritionGenerator from './NutritionGenerator';
import NutritionPlanDisplay from './NutritionPlanDisplay';
import ExportModal from './ExportModal';
import { useAuth } from '@/hooks/useAuth';
import { saveNutritionPlan } from '@/services/nutritionService';

interface NutritionSectionProps {
  userData: UserData;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ userData }) => {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const { toast } = useToast();
  const nutritionPlanRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

  useEffect(() => {
    const savedRequestId = localStorage.getItem('nutritionPlanRequestId');
    if (savedRequestId && user) {
      setCurrentRequestId(savedRequestId);
      checkExistingPlan(savedRequestId);
    } else if (user) {
      // Essayer de récupérer le plan le plus récent de l'utilisateur
      fetchUserLatestPlan();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const fetchUserLatestPlan = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 = pas de résultat, c'est normal s'il n'y a pas encore de plan
          console.error("Erreur lors de la récupération du plan:", error);
        }
        return;
      }
      
      if (data?.content) {
        setNutritionPlan(data.content);
        toast({
          title: "Plan nutritionnel récupéré",
          description: "Votre dernier plan nutritionnel personnalisé a été récupéré.",
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du plan utilisateur:", err);
    }
  };

  const checkExistingPlan = async (requestId: string) => {
    if (!user) return;
    
    try {
      // D'abord, vérifier dans la table nutrition_plans pour ce user spécifique
      const { data: userPlan, error: userPlanError } = await supabase
        .from('nutrition_plans')
        .select('content')
        .eq('user_id', user.id)
        .eq('request_id', requestId)
        .maybeSingle();
        
      if (!userPlanError && userPlan?.content) {
        setNutritionPlan(userPlan.content);
        toast({
          title: "Plan nutritionnel récupéré",
          description: "Votre plan nutritionnel personnalisé a été récupéré.",
        });
        return;
      }
      
      // Sinon, vérifier dans generated_content
      const { data, error } = await supabase
        .from('generated_content')
        .select('content, status, user_id')
        .eq('request_id', requestId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du plan existant:", error);
        return;
      }

      // Vérifier que le contenu appartient à l'utilisateur actuel
      if (data && data.user_id === user.id) {
        if (data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          
          // Sauvegarder le plan pour l'utilisateur connecté s'il n'existe pas déjà
          try {
            await saveNutritionPlan(data.content, user.id, requestId);
          } catch (saveError) {
            console.error("Erreur lors de la sauvegarde du plan:", saveError);
          }
          
          toast({
            title: "Plan nutritionnel récupéré",
            description: "Votre plan nutritionnel personnalisé a été récupéré.",
          });
        } else if (data.status === 'processing') {
          setLoading(true);
          startPolling(requestId);
          toast({
            title: "Génération en cours",
            description: "Votre plan nutritionnel est toujours en cours de génération.",
          });
        } else if (data.status === 'error') {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération précédente.",
            variant: "destructive"
          });
          localStorage.removeItem('nutritionPlanRequestId');
        }
      } else {
        // Si le requestId ne correspond pas à l'utilisateur actuel, nettoyer
        localStorage.removeItem('nutritionPlanRequestId');
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du plan existant:", err);
    }
  };

  const startPolling = (requestId: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = window.setInterval(async () => {
      if (!user) {
        clearInterval(interval);
        setPollingInterval(null);
        return;
      }
      
      try {
        // Vérifier d'abord dans la table nutrition_plans
        const { data: userPlan, error: userPlanError } = await supabase
          .from('nutrition_plans')
          .select('content')
          .eq('user_id', user.id)
          .eq('request_id', requestId)
          .maybeSingle();
          
        if (!userPlanError && userPlan?.content) {
          setNutritionPlan(userPlan.content);
          setLoading(false);
          setRegenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          
          toast({
            title: "Plan nutritionnel généré",
            description: "Votre plan nutritionnel personnalisé est prêt !",
          });
          return;
        }
        
        // Sinon, vérifier dans generated_content
        const { data, error } = await supabase
          .from('generated_content')
          .select('content, status, user_id')
          .eq('request_id', requestId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors du polling:", error);
          return;
        }

        // Vérifier que le contenu appartient à l'utilisateur actuel
        if (data && data.user_id === user.id) {
          if (data.status === 'completed' && data.content) {
            setNutritionPlan(data.content);
            setLoading(false);
            setRegenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            
            // Sauvegarder le plan pour l'utilisateur connecté
            try {
              await saveNutritionPlan(data.content, user.id, requestId);
            } catch (saveError) {
              console.error("Erreur lors de la sauvegarde du plan:", saveError);
            }
            
            toast({
              title: "Plan nutritionnel généré",
              description: "Votre plan nutritionnel personnalisé est prêt !",
            });
          } else if (data.status === 'error') {
            setLoading(false);
            setRegenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            localStorage.removeItem('nutritionPlanRequestId');
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la génération du plan.",
              variant: "destructive"
            });
          }
        } else {
          // Si le requestId ne correspond pas à l'utilisateur actuel, nettoyer
          clearInterval(interval);
          setPollingInterval(null);
          localStorage.removeItem('nutritionPlanRequestId');
        }
      } catch (err) {
        console.error("Erreur lors du polling:", err);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  const generateNutritionPlan = async (regenerate = false) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer un plan nutritionnel.",
        variant: "destructive"
      });
      return;
    }
    
    if (regenerate) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }

    const prompt = generateNutritionPrompt(userData);
    
    if (!prompt) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan nutritionnel, données incomplètes.",
        variant: "destructive"
      });
      setLoading(false);
      setRegenerating(false);
      return;
    }

    try {
      const requestId = crypto.randomUUID();
      setCurrentRequestId(requestId);
      localStorage.setItem('nutritionPlanRequestId', requestId);
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          type: 'nutrition',
          previousRecipes: regenerate ? previousRecipes : [],
          requestId,
          userId: user.id
        }
      });

      if (error) {
        throw error;
      }
      
      if (data?.status === 'processing') {
        toast({
          title: "Génération en cours",
          description: "Votre plan nutritionnel est en cours de génération. Vous pouvez naviguer sur le site, nous vous notifierons une fois terminé.",
        });
        
        startPolling(requestId);
      } else if (data?.content) {
        if (regenerate) {
          const recipePattern = /##\s*(.*?)(?=\n)/g;
          const currentRecipes = Array.from(nutritionPlan?.matchAll(recipePattern) || []).map(match => match[1].trim());
          setPreviousRecipes([...previousRecipes, ...currentRecipes]);
        }
        
        setNutritionPlan(data.content);
        
        // Sauvegarder le plan pour l'utilisateur
        try {
          await saveNutritionPlan(data.content, user.id, requestId);
        } catch (saveError) {
          console.error("Erreur lors de la sauvegarde du plan:", saveError);
        }
        
        setLoading(false);
        setRegenerating(false);
      }
    } catch (error) {
      console.error("Erreur lors de la génération du plan nutritionnel:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
      setLoading(false);
      setRegenerating(false);
    }
  };

  if (!isDataComplete) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-xl font-medium text-brand-primary mb-4">Nutrition</h3>
        <div className="text-gray-600 space-y-4">
          <p>Pour obtenir des recommandations nutritionnelles personnalisées, veuillez compléter vos informations dans le profil :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Poids</li>
            <li>Pourcentage de masse grasse</li>
            <li>Niveau d'activité</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-medium text-brand-primary mb-4">Nutrition</h3>
      
      {!nutritionPlan ? (
        <NutritionGenerator
          nutritionData={nutritionData}
          showMetrics={showMetrics}
          setShowMetrics={setShowMetrics}
          loading={loading}
          generateNutritionPlan={generateNutritionPlan}
        />
      ) : (
        <>
          <NutritionPlanDisplay
            nutritionPlan={nutritionPlan}
            nutritionPlanRef={nutritionPlanRef}
            regenerating={regenerating}
            setNutritionPlan={setNutritionPlan}
            setExportModalOpen={setExportModalOpen}
            generateNutritionPlan={generateNutritionPlan}
          />
          
          {exportModalOpen && (
            <ExportModal 
              open={exportModalOpen} 
              onClose={() => setExportModalOpen(false)} 
              nutritionPlan={nutritionPlan}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NutritionSection;
