
import React, { useState } from 'react';
import { UserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { Loader2, ArrowDown, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NutritionSectionProps {
  userData: UserData;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ userData }) => {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

  const generateNutritionPlan = async () => {
    setLoading(true);
    try {
      // Dans une application réelle, vous appelleriez ici l'API OpenAI 
      // avec le prompt généré par generateNutritionPrompt(userData)
      
      // Simuler un appel API avec setTimeout
      setTimeout(() => {
        // Exemple de plan nutritionnel (dans la vraie implémentation, il viendrait de l'API OpenAI)
        const examplePlan = `
# Plan Nutritionnel Personnalisé

## Résumé
- Calories quotidiennes: ${nutritionData?.targetCalories} kcal
- Protéines: ${nutritionData?.macros.protein}g (${Math.round(nutritionData?.macros.protein! * 4 / nutritionData?.targetCalories! * 100)}%)
- Glucides: ${nutritionData?.macros.carbs}g (${Math.round(nutritionData?.macros.carbs! * 4 / nutritionData?.targetCalories! * 100)}%)
- Lipides: ${nutritionData?.macros.fats}g (${Math.round(nutritionData?.macros.fats! * 9 / nutritionData?.targetCalories! * 100)}%)

## Jour 1
- **Petit-déjeuner**: Omelette aux épinards (3 œufs) avec avocat et pain complet
- **Collation**: Yaourt grec avec myrtilles et une poignée d'amandes
- **Déjeuner**: Poitrine de poulet grillée avec quinoa et légumes rôtis
- **Collation**: Smoothie protéiné (lait d'amande, banane, protéine en poudre)
- **Dîner**: Saumon grillé avec patate douce et brocoli

*Note: Ceci est un exemple simplifié. Le plan réel généré par l'API serait beaucoup plus détaillé.*
        `;
        
        setNutritionPlan(examplePlan);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la génération du plan nutritionnel:", error);
      setLoading(false);
    }
  };

  if (!isDataComplete) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-xl font-medium text-brand-primary mb-4">Nutrition</h3>
        <div className="text-gray-600 space-y-4">
          <p>Pour obtenir des recommandations nutritionnelles personnalisées, veuillez compléter vos informations dans le profil :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Poids</li>
            <li>Pourcentage de masse grasse</li>
            <li>Niveau d'activité</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-medium text-brand-primary mb-4">Nutrition</h3>
      
      {!nutritionPlan ? (
        <div className="space-y-6">
          <div className="rounded-lg bg-brand-primary/5 p-4 border border-brand-primary/20">
            <div className="flex items-start justify-between">
              <h4 className="font-medium mb-2">Vos métriques nutritionnelles calculées</h4>
              <button 
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-brand-primary hover:text-brand-primary/80"
              >
                <ArrowDown className={`h-5 w-5 transform transition-transform ${showMetrics ? 'rotate-180' : ''}`} />
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
                          <p className="w-64">BMR × Facteur d'activité ({userData.activityLevel?.nap})</p>
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
                    <div className="bg-blue-100 p-2 rounded text-center">
                      <div className="font-medium text-blue-800">{nutritionData.macros.protein}g</div>
                      <div className="text-xs text-blue-600">Protéines</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded text-center">
                      <div className="font-medium text-green-800">{nutritionData.macros.carbs}g</div>
                      <div className="text-xs text-green-600">Glucides</div>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded text-center">
                      <div className="font-medium text-yellow-800">{nutritionData.macros.fats}g</div>
                      <div className="text-xs text-yellow-600">Lipides</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={generateNutritionPlan} 
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
              Ce processus peut prendre quelques instants
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-96">
              {nutritionPlan}
            </pre>
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setNutritionPlan(null)}
            >
              Retour
            </Button>
            <Button
              onClick={() => {
                // Fonction pour télécharger le plan
                const element = document.createElement("a");
                const file = new Blob([nutritionPlan], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "plan_nutritionnel.md";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Télécharger le plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionSection;
