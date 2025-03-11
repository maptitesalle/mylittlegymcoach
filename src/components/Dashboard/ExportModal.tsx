
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, ShoppingBag, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  nutritionPlan: string;
}

interface Recipe {
  day: number;
  title: string;
  ingredients: string;
  mealType: string;
}

interface Day {
  number: number;
  title: string;
  selected: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, nutritionPlan }) => {
  const [days, setDays] = useState<Day[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Record<string, boolean>>({});
  const [exportOption, setExportOption] = useState<'plan' | 'ingredients'>('plan');
  const { toast } = useToast();

  // Extraire les jours et recettes du plan
  useEffect(() => {
    if (!nutritionPlan) return;

    // Extraire les jours
    const dayMatches = nutritionPlan.match(/# Jour (\d+)/g) || [];
    const extractedDays = dayMatches.map((match, index) => {
      const dayNumber = match.match(/# Jour (\d+)/)?.[1];
      return {
        number: Number(dayNumber) || index + 1,
        title: match,
        selected: true
      };
    });
    setDays(extractedDays);

    // Extraire les recettes
    const extractedRecipes: Recipe[] = [];
    const dayRegex = /# Jour (\d+)([\s\S]*?)(?=# Jour \d+|$)/g;
    let dayMatch;
    
    while ((dayMatch = dayRegex.exec(nutritionPlan)) !== null) {
      const dayNumber = parseInt(dayMatch[1]);
      const dayContent = dayMatch[2];
      
      // Extraire les repas et leurs recettes
      const mealRegex = /## (Petit-déjeuner|Déjeuner|Dîner|Collation)([\s\S]*?)(?=## |$)/g;
      let mealMatch;
      
      while ((mealMatch = mealRegex.exec(dayContent)) !== null) {
        const mealType = mealMatch[1];
        const mealContent = mealMatch[2];
        
        // Extraire les recettes (avec un titre qui n'est pas une section)
        const recipeRegex = /([^\n#]+)[\s\S]*?### Ingrédients([\s\S]*?)(?=### |## |# |$)/g;
        let recipeMatch;
        
        while ((recipeMatch = recipeRegex.exec(mealContent)) !== null) {
          const recipeTitle = recipeMatch[1].trim();
          const ingredientsContent = recipeMatch[2].trim();
          
          extractedRecipes.push({
            day: dayNumber,
            title: recipeTitle,
            ingredients: ingredientsContent,
            mealType
          });
        }
      }
    }
    
    setRecipes(extractedRecipes);
    
    // Initialiser toutes les recettes comme sélectionnées
    const initialSelectedRecipes: Record<string, boolean> = {};
    extractedRecipes.forEach((recipe, index) => {
      initialSelectedRecipes[`${recipe.day}-${index}`] = true;
    });
    setSelectedRecipes(initialSelectedRecipes);
  }, [nutritionPlan]);

  // Sélectionner/Désélectionner toutes les recettes d'un jour
  const toggleDay = (dayNumber: number) => {
    const updatedDays = days.map(day => 
      day.number === dayNumber ? { ...day, selected: !day.selected } : day
    );
    setDays(updatedDays);
    
    const isDaySelected = !days.find(day => day.number === dayNumber)?.selected;
    
    const updatedSelectedRecipes = { ...selectedRecipes };
    recipes.forEach((recipe, index) => {
      if (recipe.day === dayNumber) {
        updatedSelectedRecipes[`${recipe.day}-${index}`] = isDaySelected;
      }
    });
    
    setSelectedRecipes(updatedSelectedRecipes);
  };

  // Gérer la sélection d'une recette individuelle
  const toggleRecipe = (dayNumber: number, recipeIndex: number) => {
    const key = `${dayNumber}-${recipeIndex}`;
    setSelectedRecipes({
      ...selectedRecipes,
      [key]: !selectedRecipes[key]
    });
    
    // Vérifier si toutes les recettes du jour sont sélectionnées
    const dayRecipes = recipes.filter(recipe => recipe.day === dayNumber);
    const dayRecipeKeys = dayRecipes.map((_, index) => `${dayNumber}-${index}`);
    
    const willAllBeSelected = dayRecipeKeys.every(recipeKey => {
      if (recipeKey === key) return !selectedRecipes[key];
      return selectedRecipes[recipeKey];
    });
    
    // Mettre à jour l'état du jour
    setDays(days.map(day => 
      day.number === dayNumber ? { ...day, selected: willAllBeSelected } : day
    ));
  };

  // Générer la liste d'ingrédients des recettes sélectionnées
  const generateIngredientsList = () => {
    const selectedRecipesList = recipes.filter((recipe, index) => 
      selectedRecipes[`${recipe.day}-${index}`]
    );
    
    let ingredientsList = "# Liste d'ingrédients pour le plan nutritionnel\n\n";
    
    // Regrouper par jour
    const recipesByDay: Record<number, Recipe[]> = {};
    selectedRecipesList.forEach(recipe => {
      if (!recipesByDay[recipe.day]) {
        recipesByDay[recipe.day] = [];
      }
      recipesByDay[recipe.day].push(recipe);
    });
    
    // Générer la liste pour chaque jour
    Object.entries(recipesByDay).forEach(([day, dayRecipes]) => {
      ingredientsList += `## Jour ${day}\n\n`;
      
      dayRecipes.forEach(recipe => {
        ingredientsList += `### ${recipe.title} (${recipe.mealType})\n`;
        ingredientsList += recipe.ingredients + "\n\n";
      });
    });
    
    return ingredientsList;
  };

  // Générer le plan nutritionnel pour les jours sélectionnés
  const generateSelectedPlan = () => {
    const selectedDayNumbers = days.filter(day => day.selected).map(day => day.number);
    const dayRegex = /# Jour (\d+)([\s\S]*?)(?=# Jour \d+|$)/g;
    let selectedPlan = "# Plan Nutritionnel Personnalisé\n\n";
    
    let dayMatch;
    while ((dayMatch = dayRegex.exec(nutritionPlan)) !== null) {
      const dayNumber = parseInt(dayMatch[1]);
      if (selectedDayNumbers.includes(dayNumber)) {
        selectedPlan += `# Jour ${dayNumber}${dayMatch[2]}`;
      }
    }
    
    return selectedPlan;
  };

  // Télécharger le contenu exporté
  const handleExport = () => {
    let content = "";
    let filename = "";
    
    if (exportOption === 'ingredients') {
      content = generateIngredientsList();
      filename = "liste_ingredients.md";
    } else {
      content = generateSelectedPlan();
      filename = "plan_nutritionnel.md";
    }
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Export réussi",
      description: `Le fichier ${filename} a été téléchargé.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter le plan nutritionnel</DialogTitle>
          <DialogDescription>
            Sélectionnez les jours et les recettes que vous souhaitez exporter.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 space-y-4">
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant={exportOption === 'plan' ? "default" : "outline"}
              onClick={() => setExportOption('plan')}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Plan complet</span>
            </Button>
            <Button
              variant={exportOption === 'ingredients' ? "default" : "outline"}
              onClick={() => setExportOption('ingredients')}
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Liste d'ingrédients</span>
            </Button>
          </div>

          <div className="space-y-3">
            {days.map((day) => (
              <div key={day.number} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.number}`} 
                    checked={day.selected}
                    onCheckedChange={() => toggleDay(day.number)}
                  />
                  <Label htmlFor={`day-${day.number}`} className="font-medium">
                    Jour {day.number}
                  </Label>
                </div>
                
                {day.selected && (
                  <div className="ml-6 space-y-1">
                    {recipes
                      .filter(recipe => recipe.day === day.number)
                      .map((recipe, index) => (
                        <div key={`${day.number}-${index}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`recipe-${day.number}-${index}`} 
                            checked={selectedRecipes[`${day.number}-${index}`] || false}
                            onCheckedChange={() => toggleRecipe(day.number, index)}
                          />
                          <Label htmlFor={`recipe-${day.number}-${index}`} className="text-sm">
                            {recipe.title} ({recipe.mealType})
                          </Label>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
