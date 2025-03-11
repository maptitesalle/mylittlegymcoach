
import React, { useState, useRef } from 'react';
import { UserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { Loader2, ArrowDown, Info, MailIcon, RefreshCw, ChevronDown, ChevronUp, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface NutritionSectionProps {
  userData: UserData;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ userData }) => {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const { toast } = useToast();
  const nutritionPlanRef = useRef<HTMLDivElement>(null);

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

  const generateNutritionPlan = async (regenerate = false) => {
    if (regenerate) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }

    const prompt = generateNutritionPrompt(userData);
    
    if (!prompt) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan nutritionnel, données incomplètes.",
        variant: "destructive"
      });
      setLoading(false);
      setRegenerating(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          prompt,
          type: 'nutrition',
          previousRecipes: regenerate ? previousRecipes : []
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (regenerate) {
        // Extraire les noms de recettes du plan actuel pour ne pas les répéter
        const recipePattern = /##\s*(.*?)(?=\n)/g;
        const currentRecipes = [...nutritionPlan?.matchAll(recipePattern) || []].map(match => match[1].trim());
        setPreviousRecipes([...previousRecipes, ...currentRecipes]);
      }
      
      setNutritionPlan(data.content);
    } catch (error) {
      console.error("Erreur lors de la génération du plan nutritionnel:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleSendByEmail = () => {
    // Simulation d'envoi par email
    toast({
      title: "Envoi par email",
      description: "Fonctionnalité à implémenter avec un service d'email",
    });
  };

  const extractRecipeNames = (markdownContent: string): string[] => {
    if (!markdownContent) return [];
    const recipePattern = /##\s*(.*?)(?=\n)/g;
    return [...markdownContent.matchAll(recipePattern)].map(match => match[1].trim());
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
              Ce processus peut prendre quelques instants
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4" ref={nutritionPlanRef}>
          <div className="flex justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNutritionPlan(null)}
            >
              Retour
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendByEmail}
              >
                <MailIcon className="h-4 w-4 mr-1" />
                Envoyer par email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([nutritionPlan], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = "plan_nutritionnel.md";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateNutritionPlan(true)}
                disabled={regenerating}
              >
                {regenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Régénérer
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-brand-primary">Plan Nutritionnel Personnalisé</h2>
              <p className="text-sm text-gray-500">Basé sur vos données personnelles et objectifs</p>
            </div>
            
            {/* Utilisez ReactMarkdown pour parser le contenu markdown */}
            <div className="p-4 prose prose-sm max-w-none">
              <Accordion type="single" collapsible className="w-full">
                {nutritionPlan.split(/(?=# Jour \d+)/).filter(day => day.trim()).map((day, index) => {
                  const dayMatch = day.match(/# (Jour \d+)/);
                  const dayTitle = dayMatch ? dayMatch[1] : `Jour ${index + 1}`;
                  
                  return (
                    <AccordionItem value={`day-${index}`} key={`day-${index}`}>
                      <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                        {dayTitle}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ReactMarkdown>
                          {day.replace(/# Jour \d+\n/, '')}
                        </ReactMarkdown>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionSection;
