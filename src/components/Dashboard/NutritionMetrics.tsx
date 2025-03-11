
import React from 'react';
import { Info } from 'lucide-react';
import { Apple, Egg, Fish } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NutritionMetricsProps {
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
}

const MacroIcon = ({ type }: { type: 'protein' | 'carbs' | 'fats' }) => {
  switch (type) {
    case 'protein':
      return <Egg className="h-5 w-5 text-blue-600" />;
    case 'carbs':
      return <Apple className="h-5 w-5 text-green-600" />;
    case 'fats':
      return <Fish className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

const NutritionMetrics: React.FC<NutritionMetricsProps> = ({ 
  nutritionData, 
  showMetrics, 
  setShowMetrics 
}) => {
  return (
    <div className="rounded-lg bg-brand-primary/5 p-4 border border-brand-primary/20">
      <div className="flex items-start justify-between">
        <h4 className="font-medium mb-2">Vos métriques nutritionnelles calculées</h4>
        <button 
          onClick={() => setShowMetrics(!showMetrics)}
          className="text-brand-primary hover:text-brand-primary/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={`transform transition-transform ${showMetrics ? 'rotate-180' : ''}`}>
            <path d="M12 5v14"/>
            <path d="M19 12l-7 7-7-7"/>
          </svg>
        </button>
      </div>
      
      {showMetrics && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              Masse maigre (LBM)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Calculée avec la formule: Poids total × (1 – % de masse grasse)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium">{nutritionData.lbm} kg</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              Métabolisme basal (BMR)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Calculé avec la formule de Katch-McArdle: 370 + (21.6 × LBM)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium">{nutritionData.bmr} kcal</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              Dépense énergétique totale (TDEE)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">BMR × Facteur d'activité</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium">{nutritionData.tdee} kcal</span>
          </div>
          
          <div className="flex justify-between items-center font-medium text-brand-primary">
            <span>Calories quotidiennes recommandées</span>
            <span>{nutritionData.targetCalories} kcal</span>
          </div>
          
          <div className="pt-2 mt-2 border-t">
            <div className="text-sm font-medium mb-2">Répartition des macronutriments:</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-100 p-3 rounded text-center flex flex-col items-center">
                <div className="mb-1"><MacroIcon type="protein" /></div>
                <div className="font-medium text-blue-800">{nutritionData.macros.protein}g</div>
                <div className="text-xs text-blue-600">Protéines</div>
              </div>
              <div className="bg-green-100 p-3 rounded text-center flex flex-col items-center">
                <div className="mb-1"><MacroIcon type="carbs" /></div>
                <div className="font-medium text-green-800">{nutritionData.macros.carbs}g</div>
                <div className="text-xs text-green-600">Glucides</div>
              </div>
              <div className="bg-yellow-100 p-3 rounded text-center flex flex-col items-center">
                <div className="mb-1"><MacroIcon type="fats" /></div>
                <div className="font-medium text-yellow-800">{nutritionData.macros.fats}g</div>
                <div className="text-xs text-yellow-600">Lipides</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionMetrics;
export { MacroIcon };
