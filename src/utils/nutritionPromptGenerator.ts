
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
  Tu es un expert en nutrition et en planification de repas. Crée un plan nutritionnel personnalisé pour cette personne:
  
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
  
  Sur la base de ces informations, fournis:
  1. Un plan alimentaire détaillé sur 7 jours avec 3 repas et 2 collations par jour, en respectant les contraintes alimentaires mentionnées
  2. Une liste de courses hebdomadaire organisée par catégories (protéines, légumes, fruits, céréales, etc.)
  3. Des conseils sur le timing des repas par rapport aux entraînements pour maximiser la récupération et la performance
  4. Des recommandations spécifiques pour atteindre les objectifs mentionnés
  5. Des alternatives pour les aliments qui ne correspondent pas aux contraintes alimentaires
  
  Utilise des aliments naturels, peu transformés et facilement accessibles. Inclus des options végétariennes quand c'est possible et tiens compte des pathologies pour éviter les aliments contre-indiqués.
  `;
};
