
import { useState } from 'react';
import { UserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveNutritionPlan } from '@/services/nutritionService';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';

export function usePlanGeneration() {
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);
  const { toast } = useToast();

  const generateNutritionPlan = async (
    regenerate: boolean,
    userData: UserData,
    userId: string,
    nutritionPlan: string | null,
    setNutritionPlan: (plan: string | null) => void,
    setLoading: (loading: boolean) => void,
    setRegenerating: (regenerating: boolean) => void,
    setCurrentRequestId: (requestId: string) => void,
    startPolling: (requestId: string, userId: string, setNutritionPlan: (plan: string) => void, setLoading: (loading: boolean) => void, setRegenerating: (regenerating: boolean) => void) => void
  ) => {
    if (!userId) {
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

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: generateNutritionPrompt(userData),
          type: 'nutrition',
          previousRecipes: regenerate ? previousRecipes : [],
          requestId,
          userId
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
        
        startPolling(requestId, userId, setNutritionPlan, setLoading, setRegenerating);
      } else if (data?.content) {
        if (regenerate && nutritionPlan) {
          const recipePattern = /##\s*(.*?)(?=\n)/g;
          const currentRecipes = Array.from(nutritionPlan.matchAll(recipePattern) || []).map(match => match[1].trim());
          setPreviousRecipes([...previousRecipes, ...currentRecipes]);
        }
        
        setNutritionPlan(data.content);
        
        try {
          await saveNutritionPlan(data.content, userId, requestId);
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
    previousRecipes,
    generateNutritionPlan
  };
}
