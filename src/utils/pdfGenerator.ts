
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { parseNutritionPlan } from './nutritionParser';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateNutritionPDF = (nutritionPlan: string, userName: string = 'Utilisateur') => {
  const { days, recipes, allIngredients } = parseNutritionPlan(nutritionPlan);
  
  const doc = new jsPDF();
  
  // Ajouter le titre
  doc.setFontSize(20);
  doc.setTextColor(44, 82, 130);
  doc.text(`Plan Nutritionnel Personnalisé - ${userName}`, 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
  
  let yPos = 40;
  
  // Pour chaque jour
  for (const day of days) {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Titre du jour
    doc.setFontSize(16);
    doc.setTextColor(44, 82, 130);
    doc.text(`Jour ${day.dayNumber}`, 14, yPos);
    yPos += 8;
    
    // Résumé nutritionnel du jour
    doc.setFontSize(10);
    doc.setTextColor(100);
    if (day.totalNutrition) {
      const totalLines = doc.splitTextToSize(day.totalNutrition, 180);
      doc.text(totalLines, 14, yPos);
      yPos += totalLines.length * 5 + 5;
    }
    
    // Pour chaque repas
    for (const meal of day.meals) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Titre du repas
      doc.setFontSize(14);
      doc.setTextColor(70, 130, 180);
      doc.text(`${meal.type}: ${meal.title}`, 20, yPos);
      yPos += 8;
      
      // Ingrédients
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Ingrédients:", 25, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      for (const ingredient of meal.ingredients) {
        doc.text(`• ${ingredient}`, 30, yPos);
        yPos += 5;
      }
      
      yPos += 3;
      
      // Instructions
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Instructions:", 25, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      for (let i = 0; i < meal.instructions.length; i++) {
        const instruction = meal.instructions[i];
        const instructionLines = doc.splitTextToSize(`${i + 1}. ${instruction}`, 160);
        doc.text(instructionLines, 30, yPos);
        yPos += instructionLines.length * 5 + 2;
      }
      
      // Nutrition
      if (meal.nutritionalValues) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Valeurs nutritionnelles:", 25, yPos);
        yPos += 6;
        
        doc.setFontSize(10);
        const nutritionLines = doc.splitTextToSize(meal.nutritionalValues, 160);
        doc.text(nutritionLines, 30, yPos);
        yPos += nutritionLines.length * 5 + 10;
      } else {
        yPos += 10;
      }
    }
    
    // Ajouter un séparateur entre les jours
    doc.setDrawColor(200);
    doc.line(14, yPos - 5, 196, yPos - 5);
    yPos += 10;
  }
  
  // Créer une page d'ingrédients
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(44, 82, 130);
  doc.text("Liste complète des ingrédients", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text("Utilisez cette liste pour faire vos courses", 14, 28);
  
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
  
  // Position pour afficher les catégories
  yPos = 35;
  
  // Afficher les ingrédients par catégorie
  for (const [category, items] of Object.entries(categories)) {
    if (items.length === 0) continue;
    
    // Vérifier si on a besoin d'une nouvelle page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(70, 130, 180);
    doc.text(category, 14, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    // Créer un tableau pour les ingrédients
    const tableData = items.map(item => [item]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Ingrédient']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [220, 230, 240], 
        textColor: [50, 50, 50],
        fontStyle: 'bold',
      },
      margin: { left: 14 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: 180 } }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  return doc;
};
