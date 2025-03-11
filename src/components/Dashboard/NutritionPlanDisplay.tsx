
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { MacroIcon } from './NutritionMetrics';

interface NutritionPlanDisplayProps {
  nutritionPlan: string;
  nutritionPlanRef: React.RefObject<HTMLDivElement>;
  regenerating: boolean;
  setNutritionPlan: (plan: string | null) => void;
  setExportModalOpen: (open: boolean) => void;
  generateNutritionPlan: (regenerate: boolean) => void;
}

const NutritionPlanDisplay: React.FC<NutritionPlanDisplayProps> = ({
  nutritionPlan,
  nutritionPlanRef,
  regenerating,
  setNutritionPlan,
  setExportModalOpen,
  generateNutritionPlan
}) => {
  return (
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
    </div>
  );
};

export default NutritionPlanDisplay;
