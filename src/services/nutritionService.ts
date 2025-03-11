
import { supabase } from '@/integrations/supabase/client';
import { parseNutritionPlan } from '@/utils/nutritionParser';
import { UserData } from '@/hooks/useUserData';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import { useAuth } from '@/hooks/useAuth';

export async function saveNutritionPlan(content: string, userId: string) {
  const { days, recipes, allIngredients } = parseNutritionPlan(content);
  
  const { error } = await supabase
    .from('nutrition_plans')
    .insert({
      user_id: userId,
      content,
      recipes: JSON.stringify(recipes),
      ingredients: JSON.stringify(allIngredients)
    });
    
  if (error) {
    console.error('Erreur lors de la sauvegarde du plan:', error);
    throw error;
  }
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
