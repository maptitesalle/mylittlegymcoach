
import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { 
  Loader2, 
  ArrowDown, 
  Info, 
  MailIcon, 
  RefreshCw, 
  Download,
  Apple,
  Beef,
  Egg,
  Fish
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
import ExportModal from './ExportModal';

interface NutritionSectionProps {
  userData: UserData;
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

const NutritionSection: React.FC<NutritionSectionProps> = ({ userData }) => {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const { toast } = useToast();
  const nutritionPlanRef = useRef<HTMLDivElement>(null);

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

  useEffect(() => {
    const savedRequestId = localStorage.getItem('nutritionPlanRequestId');
    if (savedRequestId) {
      setCurrentRequestId(savedRequestId);
      checkExistingPlan(savedRequestId);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const checkExistingPlan = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('content, status')
        .eq('request_id', requestId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du plan existant:", error);
        return;
      }

      if (data) {
        if (data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          toast({
            title: "Plan nutritionnel récupéré",
            description: "Votre plan nutritionnel personnalisé précédemment généré a été récupéré.",
          });
        } else if (data.status === 'processing') {
          setLoading(true);
          startPolling(requestId);
          toast({
            title: "Génération en cours",
            description: "Votre plan nutritionnel est toujours en cours de génération.",
          });
        } else if (data.status === 'error') {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération précédente.",
            variant: "destructive"
          });
          localStorage.removeItem('nutritionPlanRequestId');
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du plan existant:", err);
    }
  };

  const startPolling = (requestId: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = window.setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('generated_content')
          .select('content, status')
          .eq('request_id', requestId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors du polling:", error);
          return;
        }

        if (data && data.status === 'completed' && data.content) {
          setNutritionPlan(data.content);
          setLoading(false);
          setRegenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          toast({
            title: "Plan nutritionnel généré",
            description: "Votre plan nutritionnel personnalisé est prêt !",
          });
        } else if (data && data.status === 'error') {
          setLoading(false);
          setRegenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          localStorage.removeItem('nutritionPlanRequestId');
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération du plan.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Erreur lors du polling:", err);
      }
    }, 5000);

    setPollingInterval(interval);
  };

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
      const requestId = crypto.randomUUID();
      setCurrentRequestId(requestId);
      localStorage.setItem('nutritionPlanRequestId', requestId);
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          type: 'nutrition',
          previousRecipes: regenerate ? previousRecipes : [],
          requestId
        }
      });

      if (error) {
        throw error;
      }
      
      if (data?.status === 'processing') {
        toast({
          title: "Génération en cours",
          description: "Votre plan nutritionnel est en cours de génération. Vous pouvez naviguer sur le site, nous vous notifierons une fois terminé.",
        });
        
        startPolling(requestId);
      } else if (data?.content) {
        if (regenerate) {
          const recipePattern = /##\s*(.*?)(?=\n)/g;
          const currentRecipes = [...nutritionPlan?.matchAll(recipePattern) || []].map(match => match[1].trim());
          setPreviousRecipes([...previousRecipes, ...currentRecipes]);
        }
        
        setNutritionPlan(data.content);
        setLoading(false);
        setRegenerating(false);
      }
    } catch (error) {
      console.error("Erreur lors de la génération du plan nutritionnel:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleSendByEmail = () => {
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
                onClick={() => setExportModalOpen(true)}
              >
                <Download className="h-4 w-4 mr-1" />
                Exporter
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
            
            <div className="p-4 prose prose-sm max-w-none">
              <Accordion type="single" collapsible className="w-full">
                {nutritionPlan
                  .split(/(?=# Jour \d+)/)
                  .filter(day => day.trim())
                  .map((day, index) => {
                    const dayMatch = day.match(/# Jour (\d+)/);
                    const dayNumber = dayMatch ? parseInt(dayMatch[1]) : index + 1;
                    
                    // Extraire les macronutriments quotidiens si présents
                    const macroMatch = day.match(/Total journalier[^\n]*?(\d+)[^\n]*?kcal[^\n]*?(\d+)g[^\n]*?(\d+)g[^\n]*?(\d+)g/);
                    const calories = macroMatch ? macroMatch[1] : "N/A";
                    const proteins = macroMatch ? macroMatch[2] : "N/A";
                    const carbs = macroMatch ? macroMatch[3] : "N/A";
                    const fats = macroMatch ? macroMatch[4] : "N/A";
                    
                    return (
                      <AccordionItem value={`day-${dayNumber}`} key={`day-${dayNumber}`} className="border-b border-gray-200">
                        <AccordionTrigger className="py-4 px-3 hover:no-underline hover:bg-gray-50 rounded-md">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-medium text-brand-primary">Jour {dayNumber}</span>
                            
                            {macroMatch && (
                              <div className="hidden md:flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <span className="text-gray-600 mr-1">{calories} kcal</span>
                                </div>
                                <div className="flex items-center">
                                  <MacroIcon type="protein" />
                                  <span className="ml-1 text-blue-600">{proteins}g</span>
                                </div>
                                <div className="flex items-center">
                                  <MacroIcon type="carbs" />
                                  <span className="ml-1 text-green-600">{carbs}g</span>
                                </div>
                                <div className="flex items-center">
                                  <MacroIcon type="fats" />
                                  <span className="ml-1 text-yellow-600">{fats}g</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          {/* Affichage des macros pour mobile */}
                          {macroMatch && (
                            <div className="md:hidden flex justify-between mb-4 p-2 bg-gray-50 rounded">
                              <div className="text-center">
                                <div className="text-gray-700 font-medium">{calories}</div>
                                <div className="text-xs text-gray-500">kcal</div>
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <MacroIcon type="protein" />
                                <div className="text-xs text-blue-600">{proteins}g</div>
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <MacroIcon type="carbs" />
                                <div className="text-xs text-green-600">{carbs}g</div>
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <MacroIcon type="fats" />
                                <div className="text-xs text-yellow-600">{fats}g</div>
                              </div>
                            </div>
                          )}
                          
                          <ReactMarkdown className="prose-h2:text-lg prose-h2:font-medium prose-h2:text-brand-primary prose-h2:mt-4 prose-h2:mb-2 prose-h3:text-base prose-h3:font-medium prose-h3:mt-3 prose-h3:mb-1">
                            {day.replace(/# Jour \d+\n/, '')}
                          </ReactMarkdown>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
              </Accordion>
            </div>
          </div>
          
          {exportModalOpen && (
            <ExportModal 
              open={exportModalOpen} 
              onClose={() => setExportModalOpen(false)} 
              nutritionPlan={nutritionPlan}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionSection;
