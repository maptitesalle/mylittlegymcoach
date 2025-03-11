
import React, { useState } from 'react';
import { UserData } from '@/hooks/useUserData';
import { calculateNutrition } from '@/utils/nutritionCalculator';
import { generateNutritionPrompt } from '@/utils/nutritionPromptGenerator';
import NutritionGenerator from './NutritionGenerator';
import NutritionPlanDisplay from './NutritionPlanDisplay';
import ExportModal from './ExportModal';
import { useNutritionPlan } from '@/hooks/useNutritionPlan';

interface NutritionSectionProps {
  userData: UserData;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ userData }) => {
  const [showMetrics, setShowMetrics] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  const {
    nutritionPlan,
    setNutritionPlan,
    loading,
    regenerating,
    nutritionPlanRef,
    generateNutritionPlan
  } = useNutritionPlan(userData);

  const nutritionData = calculateNutrition(userData);
  const isDataComplete = nutritionData !== null;

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
        <NutritionGenerator
          nutritionData={nutritionData}
          showMetrics={showMetrics}
          setShowMetrics={setShowMetrics}
          loading={loading}
          generateNutritionPlan={generateNutritionPlan}
        />
      ) : (
        <>
          <NutritionPlanDisplay
            nutritionPlan={nutritionPlan}
            nutritionPlanRef={nutritionPlanRef}
            regenerating={regenerating}
            setNutritionPlan={setNutritionPlan}
            setExportModalOpen={setExportModalOpen}
            generateNutritionPlan={generateNutritionPlan}
          />
          
          {exportModalOpen && (
            <ExportModal 
              open={exportModalOpen} 
              onClose={() => setExportModalOpen(false)} 
              nutritionPlan={nutritionPlan}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NutritionSection;
