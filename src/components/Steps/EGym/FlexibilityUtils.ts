
// Function to determine flexibility level based on value
export const getFlexibilityLevel = (value: number | undefined) => {
  if (value === undefined) return null;
  
  if (value < 30) return 'faible';
  if (value >= 30 && value < 70) return 'normal';
  return 'excellent';
};

// Function to get the numeric value from a level
export const getLevelValue = (level: string | null): number => {
  if (!level) return 0;
  
  switch (level) {
    case 'faible':
      return 15; // Moyenne de la plage "faible"
    case 'normal':
      return 50; // Moyenne de la plage "normal"
    case 'excellent':
      return 85; // Moyenne de la plage "excellent"
    default:
      return 0;
  }
};
