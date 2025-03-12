
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveNutritionPlan } from '@/services/nutritionService';

export function useExistingPlan() {
  const { toast } = useToast();

  const fetchUserLatestPlan = async (userId: string, setNutritionPlan: (plan: string) => void) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('content')
        .eq('user_id', userId)
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

  const checkExistingPlan = async (
    requestId: string, 
    userId: string, 
    setNutritionPlan: (plan: string) => void, 
    setLoading: (loading: boolean) => void,
    startPolling: (requestId: string, userId: string, setNutritionPlan: (plan: string) => void, setLoading: (loading: boolean) => void, setRegenerating: (regenerating: boolean) => void) => void
  ) => {
    if (!userId) return;
    
    try {
      const { data: userPlan, error: userPlanError } = await supabase
        .from('nutrition_plans')
        .select('content')
        .eq('user_id', userId)
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

      if (data && data.user_id === userId) {
        if (data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          
          try {
            await saveNutritionPlan(data.content, userId, requestId);
          } catch (saveError) {
            console.error("Erreur lors de la sauvegarde du plan:", saveError);
          }
          
          toast({
            title: "Plan nutritionnel récupéré",
            description: "Votre plan nutritionnel personnalisé a été récupéré.",
          });
        } else if (data.status === 'processing') {
          setLoading(true);
          startPolling(requestId, userId, setNutritionPlan, setLoading, () => {});
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

  return {
    fetchUserLatestPlan,
    checkExistingPlan
  };
}
