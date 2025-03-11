
import { UserData } from '@/hooks/useUserData';
import { calculateNutrition } from './nutritionCalculator';
import { activityLevels } from '@/components/ActivityLevelSelect';

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
  
  // Extraire le niveau d'activité
  const activityLevel = userData.activityLevel?.nap || 1.2; // Par défaut à sédentaire si non spécifié
  
  // Obtenir le libellé du niveau d'activité
  let activityLabel = 'Non renseigné';
  if (userData.activityLevel?.level && activityLevels[userData.activityLevel.level]) {
    activityLabel = activityLevels[userData.activityLevel.level].label;
  }
  
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
  - Niveau d'activité: ${activityLabel} (NAP: ${activityLevel})
  
  Calculs nutritionnels (selon Katch-McArdle):
  - Masse maigre (LBM): ${nutritionData.lbm} kg [calculée avec: Poids total × (1 – % de masse grasse)]
  - Métabolisme de base (BMR): ${nutritionData.bmr} calories [calculé avec: 370 + (21.6 × LBM)]
  - Dépense énergétique totale (TDEE): ${nutritionData.tdee} calories [calculée avec: BMR × NAP de ${activityLevel}]
  - Besoins caloriques quotidiens ajustés: ${nutritionData.targetCalories} calories
  - Macronutriments recommandés: ${nutritionData.macros.protein}g de protéines (${Math.round(nutritionData.macros.protein * 4)}kcal), ${nutritionData.macros.carbs}g de glucides (${Math.round(nutritionData.macros.carbs * 4)}kcal), ${nutritionData.macros.fats}g de lipides (${Math.round(nutritionData.macros.fats * 9)}kcal)
  
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
     - La liste complète des ingrédients avec quantités précises en grammes
     - Les instructions de préparation claires et détaillées
     - Les macronutriments du repas (protéines, glucides, lipides) et calories
  4. À la fin de chaque jour, fournis un récapitulatif des macronutriments et calories totales
  5. Utilise des aliments naturels, peu transformés et facilement accessibles
  6. Tiens compte des contraintes alimentaires et pathologies mentionnées
  7. Adapte les recettes aux objectifs spécifiques (gain musculaire, perte de poids, etc.)
  8. Varie les recettes et les ingrédients au maximum pour éviter la monotonie
  9. Assure-toi que les repas sont savoureux et pratiques à préparer
  
  Utilise un format structuré en markdown pour faciliter la lecture et l'exportation:
  - Titre principal pour chaque jour (# Jour X)
  - Sous-titres pour chaque repas (## Petit-déjeuner, ## Déjeuner, etc.)
  - Sous-sections pour les détails (### Ingrédients, ### Instructions, ### Valeurs nutritionnelles)
  - Listes à puces pour les ingrédients et instructions
  - Tableau pour le récapitulatif journalier
  `;
};
