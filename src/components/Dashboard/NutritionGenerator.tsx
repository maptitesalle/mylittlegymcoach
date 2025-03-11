
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import NutritionMetrics from './NutritionMetrics';

interface NutritionGeneratorProps {
  nutritionData: {
    lbm: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    }
  };
  showMetrics: boolean;
  setShowMetrics: (show: boolean) => void;
  loading: boolean;
  generateNutritionPlan: (regenerate: boolean) => void;
}

const NutritionGenerator: React.FC<NutritionGeneratorProps> = ({
  nutritionData,
  showMetrics,
  setShowMetrics,
  loading,
  generateNutritionPlan
}) => {
  return (
    <div className="space-y-6">
      <NutritionMetrics 
        nutritionData={nutritionData} 
        showMetrics={showMetrics} 
        setShowMetrics={setShowMetrics} 
      />
      
      <div className="text-center">
        <Button 
          onClick={() => generateNutritionPlan(false)} 
          disabled={loading}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            'Générer mon plan nutritionnel'
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Ce processus peut prendre quelques instants. Vous pouvez naviguer sur d'autres pages pendant la génération.
        </p>
      </div>
    </div>
  );
};

export default NutritionGenerator;
