
// Fonction pour calculer la masse maigre (Lean Body Mass - LBM)
export const calculateLBM = (weight: number, fatPercentage: number): number => {
  // Conversion du pourcentage en décimal si nécessaire
  const fatDecimal = fatPercentage > 1 ? fatPercentage / 100 : fatPercentage;
  return weight * (1 - fatDecimal);
};

// Fonction pour calculer le métabolisme basal (Basal Metabolic Rate - BMR) avec la formule de Katch-McArdle
export const calculateBMR = (lbm: number): number => {
  return 370 + (21.6 * lbm);
};

// Fonction pour calculer la dépense énergétique journalière totale (Total Daily Energy Expenditure - TDEE)
export const calculateTDEE = (bmr: number, activityFactor: number): number => {
  return bmr * activityFactor;
};

// Fonction pour déterminer les calories cibles en fonction des objectifs
export const calculateTargetCalories = (tdee: number, goal: string): number => {
  let deficitFactor = 1;
  
  // Ajuster le facteur selon l'objectif
  if (goal === 'weightLoss') {
    deficitFactor = 0.85; // Déficit de 15% pour la perte de poids
  } else if (goal === 'muscleMassGain') {
    deficitFactor = 1.1; // Surplus de 10% pour la prise de masse
  }
  // Pour le maintien, deficitFactor reste à 1
  
  return tdee * deficitFactor;
};

// Fonction pour calculer la répartition des macronutriments
export const calculateMacros = (weight: number, targetCalories: number, goal: string): {
  protein: number;
  carbs: number;
  fats: number;
} => {
  // Protéines: recommandation de 1.5g/kg de poids corporel pour préserver la masse maigre
  let proteinPerKg = 1.5;
  
  // Ajuster la quantité de protéines selon l'objectif
  if (goal === 'muscleMassGain') {
    proteinPerKg = 1.8; // Plus de protéines pour la prise de masse
  } else if (goal === 'weightLoss') {
    proteinPerKg = 2.0; // Encore plus pour la perte de poids (préservation de la masse musculaire)
  }
  
  const protein = weight * proteinPerKg;
  const proteinCalories = protein * 4;
  
  // Répartition des calories restantes entre lipides et glucides
  let fatPercentage = 0.35; // Par défaut 35% des calories en lipides
  
  // Ajuster les lipides selon l'objectif
  if (goal === 'cardioImprovement') {
    fatPercentage = 0.3; // Moins de lipides, plus de glucides pour l'énergie
  }
  
  const fatCalories = targetCalories * fatPercentage;
  const fats = fatCalories / 9;
  
  // Les calories restantes vont aux glucides
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = carbCalories / 4;
  
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats)
  };
};

// Fonction pour générer les données nutritionnelles complètes
export const calculateNutrition = (userData: any): {
  lbm: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  }
} | null => {
  // Extraire les données requises
  const weight = userData.eGym?.metabolic?.weight;
  const fatPercentage = userData.eGym?.metabolic?.fatPercentage;
  const activityFactor = userData.activityLevel?.nap || 1.2;
  
  // Déterminer l'objectif principal (prendre le premier objectif true dans l'ordre de priorité)
  let primaryGoal = 'maintain';
  if (userData.goals?.weightLoss) primaryGoal = 'weightLoss';
  else if (userData.goals?.muscleMassGain) primaryGoal = 'muscleMassGain';
  else if (userData.goals?.cardioImprovement) primaryGoal = 'cardioImprovement';
  
  // Vérifier que les données nécessaires sont disponibles
  if (!weight || fatPercentage === undefined) {
    return null;
  }
  
  // Calculer les valeurs nutritionnelles
  const lbm = calculateLBM(weight, fatPercentage);
  const bmr = calculateBMR(lbm);
  const tdee = calculateTDEE(bmr, activityFactor);
  const targetCalories = calculateTargetCalories(tdee, primaryGoal);
  const macros = calculateMacros(weight, targetCalories, primaryGoal);
  
  return {
    lbm: Math.round(lbm),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros
  };
};
