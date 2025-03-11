
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, FileText, ShoppingCart } from 'lucide-react';
import { generateNutritionPDF } from '@/utils/pdfGenerator';
import { parseNutritionPlan } from '@/utils/nutritionParser';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  nutritionPlan: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, nutritionPlan }) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('plan');
  
  const handleExport = async () => {
    setLoading(true);
    try {
      const doc = generateNutritionPDF(nutritionPlan);
      
      // Générer le PDF
      const pdfBlob = doc.output('blob');
      const fileName = `Plan_Nutritionnel_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Créer un lien de téléchargement
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = fileName;
      
      // Cliquer sur le lien pour télécharger
      downloadLink.click();
      
      // Nettoyer
      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error('Erreur lors de l\'exportation du PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Extraire les ingrédients pour la liste de courses
  const { allIngredients } = parseNutritionPlan(nutritionPlan);
  
  // Grouper les ingrédients par catégorie (approximative)
  const categories = {
    "Viandes et Poissons": allIngredients.filter(i => 
      i.match(/viande|boeuf|poulet|dinde|poisson|saumon|thon|porc|agneau|steak/i)),
    "Fruits et Légumes": allIngredients.filter(i => 
      i.match(/pomme|banane|orange|fraise|légume|carotte|tomate|oignon|salade|épinard|brocoli/i)),
    "Produits Laitiers": allIngredients.filter(i => 
      i.match(/lait|fromage|yaourt|yogourt|crème|beurre|oeuf/i)),
    "Féculents et Céréales": allIngredients.filter(i => 
      i.match(/riz|pâte|pain|céréale|avoine|quinoa|boulgour|pomme de terre|patate/i)),
    "Épices et Condiments": allIngredients.filter(i => 
      i.match(/épice|sel|poivre|huile|vinaigre|sauce|moutarde|mayonnaise|ketchup/i)),
    "Autres": [] as string[]
  };
  
  // Ajouter les ingrédients non catégorisés à "Autres"
  const categorizedIngredients = [
    ...categories["Viandes et Poissons"],
    ...categories["Fruits et Légumes"],
    ...categories["Produits Laitiers"],
    ...categories["Féculents et Céréales"],
    ...categories["Épices et Condiments"]
  ];
  
  categories["Autres"] = allIngredients.filter(ingredient => 
    !categorizedIngredients.includes(ingredient)
  );
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter votre plan nutritionnel</DialogTitle>
          <DialogDescription>
            Vous pouvez exporter votre plan en PDF ou consulter votre liste de courses
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="plan" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="plan" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Plan nutritionnel
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Liste de courses
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="mt-4">
            <div className="space-y-4">
              <p>Téléchargez votre plan nutritionnel complet au format PDF.</p>
              <p className="text-sm text-gray-500">
                Le document contient votre plan détaillé sur 7 jours, incluant toutes les recettes avec les ingrédients, instructions et valeurs nutritionnelles.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-4">
            <div className="space-y-4">
              <p>Utilisez cette liste pour faire vos courses pour la semaine.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(categories).map(([category, items]) => {
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={category} className="border rounded-lg p-4">
                      <h3 className="font-medium text-brand-primary mb-2">{category}</h3>
                      <ul className="space-y-1 text-sm">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {currentTab === 'plan' && (
            <Button onClick={handleExport} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                'Télécharger le PDF'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
