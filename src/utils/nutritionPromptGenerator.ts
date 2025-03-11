
import { UserData } from '@/hooks/useUserData';
import { calculateNutrition } from './nutritionCalculator';

export const generateNutritionPrompt = (userData: UserData): string | null => {
  const nutritionData = calculateNutrition(userData);
  
  if (!nutritionData) {
    return null;
  }
  
  // Extraire les données utilisateur
  const { age, gender, height } = userData;
  const { weight, fatPercentage, metabolicAge } = userData.eGym?.metabolic || {};
  const { vo2max } = userData.eGym?.cardio || {};
  
  // Extraire les objectifs
  const goals = userData.goals || {};
  
  // Extraire les contraintes alimentaires
  const diet = userData.diet || {};
  
  // Extraire les pathologies
  const health = userData.health || {};
  
  // Construire le prompt pour GPT
  return `
  Crée un plan nutritionnel personnalisé pour cette personne sur 7 jours:
  
  Données personnelles:
  - Âge: ${age} ans
  - Genre: ${gender === 'male' ? 'Homme' : gender === 'female' ? 'Femme' : 'Autre'}
  - Taille: ${height} cm
  - Poids: ${weight} kg
  - Pourcentage de masse grasse: ${fatPercentage}%
  - Âge métabolique: ${metabolicAge || 'Non renseigné'} ans
  - VO2max: ${vo2max || 'Non renseigné'}
  
  Besoins nutritionnels calculés (selon les formules Katch-McArdle):
  - Masse maigre (LBM): ${nutritionData.lbm} kg
  - Métabolisme de base (BMR): ${nutritionData.bmr} calories
  - Dépense énergétique totale (TDEE): ${nutritionData.tdee} calories
  - Besoins caloriques quotidiens ajustés: ${nutritionData.targetCalories} calories
  - Macronutriments recommandés: ${nutritionData.macros.protein}g de protéines, ${nutritionData.macros.carbs}g de glucides, ${nutritionData.macros.fats}g de lipides
  
  Objectifs:
  ${goals.muscleMassGain ? '- Prise de masse musculaire\n' : ''}
  ${goals.weightLoss ? '- Perte de poids\n' : ''}
  ${goals.flexibilityImprovement ? '- Amélioration de la souplesse\n' : ''}
  ${goals.cardioImprovement ? '- Amélioration de la capacité cardio\n' : ''}
  ${goals.maintainLevel ? '- Maintien du niveau actuel\n' : ''}
  
  Contraintes alimentaires:
  ${diet.glutenFree ? '- Sans gluten\n' : ''}
  ${diet.vegan ? '- Vegan\n' : ''}
  ${diet.eggFree ? '- Sans œuf\n' : ''}
  ${diet.dairyFree ? '- Sans produit laitier\n' : ''}
  
  Pathologies à considérer:
  ${health.heartFailure ? '- Insuffisance cardiaque\n' : ''}
  ${health.arthritis ? '- Arthrose\n' : ''}
  ${health.respiratoryProblems ? '- Problèmes respiratoires\n' : ''}
  ${health.obesity ? '- Obésité\n' : ''}
  ${health.hypothyroidism ? '- Hypothyroïdie\n' : ''}
  ${health.otherInfo ? `- Autres: ${health.otherInfo}\n` : ''}
  
  Directives importantes:
  1. Crée un plan alimentaire précis pour 7 jours, avec exactement 3 repas et 1 collation par jour
  2. Chaque jour doit respecter les macronutriments recommandés (${nutritionData.macros.protein}g de protéines, ${nutritionData.macros.carbs}g de glucides, ${nutritionData.macros.fats}g de lipides) et le total calorique (${nutritionData.targetCalories} calories)
  3. Pour chaque repas, fournis:
     - Le nom de la recette
     - La liste complète des ingrédients avec quantités précises
     - Les instructions de préparation
     - Les macronutriments du repas (protéines, glucides, lipides) et calories
  4. À la fin de chaque jour, fournis un récapitulatif des macronutriments et calories totales
  5. Utilise des aliments naturels, peu transformés et facilement accessibles
  6. Tiens compte des contraintes alimentaires et pathologies mentionnées
  7. Adapte les recettes aux objectifs spécifiques
  
  Utilise un format structuré en markdown pour faciliter la lecture et l'exportation.
  `;
};
