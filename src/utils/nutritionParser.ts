
interface Recipe {
  day: number;
  meal: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValues: string;
}

interface Day {
  dayNumber: number;
  meals: {
    title: string;
    type: string;
    ingredients: string[];
    instructions: string[];
    nutritionalValues: string;
  }[];
  totalNutrition: string;
}

export const parseNutritionPlan = (content: string): {
  days: Day[];
  recipes: Recipe[];
  allIngredients: string[];
} => {
  const days: Day[] = [];
  const recipes: Recipe[] = [];
  const allIngredients: string[] = [];

  // Découper le contenu par jours
  const dayChunks = content.split(/# Jour \d+/).filter(chunk => chunk.trim());
  
  // Pour chaque jour
  for (let i = 0; i < dayChunks.length; i++) {
    const dayNumber = i + 1;
    const dayContent = dayChunks[i];
    
    const meals: Day['meals'] = [];
    
    // Extraire les repas
    const mealTypes = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];
    let totalNutrition = '';
    
    for (const mealType of mealTypes) {
      const mealRegex = new RegExp(`## ${mealType}([\\s\\S]*?)(?=## |$)`, 'g');
      const mealMatch = mealRegex.exec(dayContent);
      
      if (mealMatch) {
        const mealContent = mealMatch[1].trim();
        
        // Extraire le titre de la recette (première ligne après le type de repas)
        const titleMatch = mealContent.match(/^(.+?)(?=\n|$)/);
        const title = titleMatch ? titleMatch[1].trim() : `${mealType} du Jour ${dayNumber}`;
        
        // Extraire les ingrédients
        const ingredientsRegex = /### Ingrédients([\s\S]*?)(?=### |$)/;
        const ingredientsMatch = mealContent.match(ingredientsRegex);
        const ingredientsSection = ingredientsMatch ? ingredientsMatch[1].trim() : '';
        const ingredients = ingredientsSection
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().substring(2).trim());
        
        // Ajouter les ingrédients à la liste complète
        allIngredients.push(...ingredients);
        
        // Extraire les instructions
        const instructionsRegex = /### Instructions([\s\S]*?)(?=### |$)/;
        const instructionsMatch = mealContent.match(instructionsRegex);
        const instructionsSection = instructionsMatch ? instructionsMatch[1].trim() : '';
        const instructions = instructionsSection
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().substring(2).trim());
        
        // Extraire les valeurs nutritionnelles
        const nutritionalRegex = /### Valeurs nutritionnelles([\s\S]*?)(?=## |$)/;
        const nutritionalMatch = mealContent.match(nutritionalRegex);
        const nutritionalValues = nutritionalMatch ? nutritionalMatch[1].trim() : '';
        
        // Ajouter le repas au jour
        meals.push({
          title,
          type: mealType,
          ingredients,
          instructions,
          nutritionalValues
        });
        
        // Ajouter la recette à la liste
        recipes.push({
          day: dayNumber,
          meal: mealType,
          title,
          ingredients,
          instructions,
          nutritionalValues
        });
      }
    }
    
    // Récupérer le total nutritionnel du jour
    const totalNutritionRegex = /Total journalier[\s\S]*?$/;
    const totalMatch = dayContent.match(totalNutritionRegex);
    if (totalMatch) {
      totalNutrition = totalMatch[0].trim();
    }
    
    // Ajouter le jour à la liste
    days.push({
      dayNumber,
      meals,
      totalNutrition
    });
  }
  
  return {
    days,
    recipes,
    allIngredients: [...new Set(allIngredients)] // Éliminer les doublons
  };
};
