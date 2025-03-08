
// Simulated response data for development (to be replaced with actual OpenAI API calls)
const simulateAIResponse = (prompt: string, section: string): Promise<string> => {
  // In a real implementation, this would be an API call to OpenAI
  console.log(`Generating AI response for ${section} with prompt: ${prompt}`);
  
  // Simulated responses based on section
  const responses: Record<string, string> = {
    nutrition: "Basé sur vos données, nous vous recommandons un régime équilibré riche en protéines (viandes maigres, poissons, légumineuses) pour soutenir votre prise de masse musculaire. Consommez des glucides complexes (riz complet, patates douces) autour de vos entraînements pour maximiser l'énergie et la récupération. Privilégiez les légumes verts pour les vitamines et minéraux essentiels.",
    
    supplements: "Pour compléter votre alimentation, envisagez une supplémentation en protéines (whey ou végétale selon vos préférences) après l'entraînement. La créatine monohydrate (5g/jour) peut être bénéfique pour votre objectif de force. Un complexe de vitamines B pourrait aider votre métabolisme énergétique.",
    
    flexibility: "Pratiquez des étirements statiques pour vos épaules et hanches au moins 3 fois par semaine, en maintenant chaque position 30-45 secondes. Intégrez le yoga ou le Pilates une fois par semaine pour améliorer votre flexibilité globale. N'oubliez pas de vous échauffer avant les étirements intensifs.",
    
    gym: "Concentrez-vous sur des exercices composés (squats, soulevés de terre, développé couché) avec une charge modérée à lourde (70-85% de votre max) pour 3-4 séries de 8-12 répétitions. Alternez entre haut et bas du corps, avec 48h de récupération entre les séances ciblant les mêmes groupes musculaires."
  };
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(responses[section] || "Aucune recommandation disponible pour le moment.");
    }, 500);
  });
};

export const generateNutritionAdvice = async (userData: any): Promise<string> => {
  const prompt = `Données utilisateur: ${JSON.stringify(userData)}. Fournir des conseils nutritionnels personnalisés.`;
  return simulateAIResponse(prompt, 'nutrition');
};

export const generateSupplementsAdvice = async (userData: any): Promise<string> => {
  const prompt = `Données utilisateur: ${JSON.stringify(userData)}. Fournir des conseils sur les compléments alimentaires adaptés.`;
  return simulateAIResponse(prompt, 'supplements');
};

export const generateFlexibilityAdvice = async (userData: any): Promise<string> => {
  const prompt = `Données utilisateur: ${JSON.stringify(userData)}. Fournir des conseils sur les exercices de souplesse recommandés.`;
  return simulateAIResponse(prompt, 'flexibility');
};

export const generateGymAdvice = async (userData: any): Promise<string> => {
  const prompt = `Données utilisateur: ${JSON.stringify(userData)}. Fournir des conseils sur les exercices et entraînements en salle de sport.`;
  return simulateAIResponse(prompt, 'gym');
};
