
import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import NutritionGenerator from './NutritionGenerator';
import NutritionPlanDisplay from './NutritionPlanDisplay';
import ExportModal from './ExportModal';

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

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

  useEffect(() => {
    const savedRequestId = localStorage.getItem('nutritionPlanRequestId');
    if (savedRequestId) {
      setCurrentRequestId(savedRequestId);
      checkExistingPlan(savedRequestId);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const checkExistingPlan = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('content, status')
        .eq('request_id', requestId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du plan existant:", error);
        return;
      }

      if (data) {
        if (data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          toast({
            title: "Plan nutritionnel récupéré",
            description: "Votre plan nutritionnel personnalisé précédemment généré a été récupéré.",
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
      try {
        const { data, error } = await supabase
          .from('generated_content')
          .select('content, status')
          .eq('request_id', requestId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors du polling:", error);
          return;
        }

        if (data && data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          setLoading(false);
          setRegenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          toast({
            title: "Plan nutritionnel généré",
            description: "Votre plan nutritionnel personnalisé est prêt !",
          });
        } else if (data && data.status === 'error') {
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
      } catch (err) {
        console.error("Erreur lors du polling:", err);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  const generateNutritionPlan = async (regenerate = false) => {
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
          requestId
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
          const currentRecipes = [...nutritionPlan?.matchAll(recipePattern) || []].map(match => match[1].trim());
          setPreviousRecipes([...previousRecipes, ...currentRecipes]);
        }
        
        setNutritionPlan(data.content);
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

  const handleSendByEmail = () => {
    toast({
      title: "Envoi par email",
      description: "Fonctionnalité à implémenter avec un service d'email",
    });
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
            handleSendByEmail={handleSendByEmail}
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
