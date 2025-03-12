
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveNutritionPlan } from '@/services/nutritionService';

export function useNutritionPolling() {
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const startPolling = (
    requestId: string,
    userId: string,
    setNutritionPlan: (plan: string) => void,
    setLoading: (loading: boolean) => void,
    setRegenerating: (regenerating: boolean) => void
  ) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = window.setInterval(async () => {
      if (!userId) {
        clearInterval(interval);
        setPollingInterval(null);
        return;
      }
      
      try {
        const { data: userPlan, error: userPlanError } = await supabase
          .from('nutrition_plans')
          .select('content')
          .eq('user_id', userId)
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

        if (data && data.user_id === userId) {
          if (data.status === 'completed' && data.content) {
            setNutritionPlan(data.content);
            setLoading(false);
            setRegenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            
            try {
              await saveNutritionPlan(data.content, userId, requestId);
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

  return {
    pollingInterval,
    startPolling
  };
}
