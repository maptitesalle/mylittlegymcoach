import { useState, useEffect, useRef } from 'react';
import { UserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveNutritionPlan, generateNutritionPlanContent } from '@/services/nutritionService';
import { useAuth } from '@/hooks/useAuth';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator'; 

export function useNutritionPlan(userData: UserData) {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const nutritionPlanRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedRequestId = localStorage.getItem('nutritionPlanRequestId');
    if (savedRequestId && user) {
      setCurrentRequestId(savedRequestId);
      checkExistingPlan(savedRequestId);
    } else if (user) {
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
        if (error.code !== 'PGRST116') {
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
      const { data: userPlan, error: userPlanError } = await supabase
        .from('nutrition_plans')
        .select('content')
        .eq('user_id', user.id)
        .eq('request_id', requestId)
        .single();
        
      if (userPlanError) {
        if (userPlanError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du plan existant:", userPlanError);
        }
      } else if (userPlan?.content) {
        setNutritionPlan(userPlan.content);
        toast({
          title: "Plan nutritionnel récupéré",
          description: "Votre plan nutritionnel personnalisé a été récupéré.",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('generated_content')
        .select('content, status, user_id')
        .eq('request_id', requestId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du plan existant:", error);
        }
        return;
      }

      if (data && data.user_id === user.id) {
        if (data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          
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
        const { data: userPlan, error: userPlanError } = await supabase
          .from('nutrition_plans')
          .select('content')
          .eq('user_id', user.id)
          .eq('request_id', requestId)
          .single();
          
        if (userPlanError) {
          if (userPlanError.code !== 'PGRST116') {
            console.error("Erreur lors du polling:", userPlanError);
          }
        } else if (userPlan?.content) {
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
        
        const { data, error } = await supabase
          .from('generated_content')
          .select('content, status, user_id')
          .eq('request_id', requestId)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error("Erreur lors du polling:", error);
          }
          return;
        }

        if (data && data.user_id === user.id) {
          if (data.status === 'completed' && data.content) {
            setNutritionPlan(data.content);
            setLoading(false);
            setRegenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            
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

    try {
      const requestId = crypto.randomUUID();
      setCurrentRequestId(requestId);
      localStorage.setItem('nutritionPlanRequestId', requestId);
      
      if (!user.id) {
        throw new Error("ID utilisateur non disponible");
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: generateNutritionPrompt(userData),
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

  return {
    nutritionPlan,
    setNutritionPlan,
    loading,
    regenerating,
    nutritionPlanRef,
    generateNutritionPlan
  };
}
