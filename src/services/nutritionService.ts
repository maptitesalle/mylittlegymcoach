
import { supabase } from '@/integrations/supabase/client';
import { parseNutritionPlan } from '@/utils/nutritionParser';
import { UserData } from '@/hooks/useUserData';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';

export async function saveNutritionPlan(content: string, userId: string, requestId?: string) {
  const { days, recipes, allIngredients } = parseNutritionPlan(content);
  
  const planData = {
    user_id: userId,
    content,
    recipes: JSON.stringify(recipes),
    ingredients: JSON.stringify(allIngredients),
    ...(requestId && { request_id: requestId })
  };
  
  // Vérifier si un plan avec ce requestId existe déjà
  if (requestId) {
    try {
      const { data: existingPlan, error: checkError } = await supabase
        .from('nutrition_plans')
        .select('id')
        .eq('user_id', userId)
        .eq('request_id', requestId)
        .single();
        
      if (!checkError && existingPlan) {
        // Mettre à jour le plan existant
        const { error } = await supabase
          .from('nutrition_plans')
          .update(planData)
          .eq('id', existingPlan.id);
          
        if (error) {
          console.error('Erreur lors de la mise à jour du plan:', error);
          throw error;
        }
        
        return existingPlan.id;
      }
    } catch (error) {
      // Si l'erreur est "No rows returned", c'est normal car nous allons créer un nouveau plan
      if (error.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification du plan existant:', error);
        throw error;
      }
    }
  }
  
  // Insérer un nouveau plan
  const { data, error } = await supabase
    .from('nutrition_plans')
    .insert(planData)
    .select('id')
    .single();
    
  if (error) {
    console.error('Erreur lors de la sauvegarde du plan:', error);
    throw error;
  }
  
  return data?.id;
}

export async function getUserNutritionPlans(userId: string) {
  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    throw error;
  }
  
  return data;
}

export async function generateNutritionPlanContent(
  userData: UserData,
  previousRecipes: string[] = [],
  requestId: string,
  userId: string
) {
  const prompt = generateNutritionPrompt(userData);
  
  if (!prompt) {
    throw new Error("Impossible de générer le prompt, données utilisateur incomplètes");
  }
  
  const { data, error } = await supabase.functions.invoke('generate-content', {
    body: {
      prompt,
      type: 'nutrition',
      previousRecipes,
      requestId,
      userId
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}
