
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Step2Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2: React.FC<Step2Props> = ({ userData, updateUserData, onNext, onPrevious }) => {
  const goals = userData.goals || {};

  const handleGoalChange = (goal: keyof NonNullable<UserData['goals']>, checked: boolean) => {
    updateUserData({
      goals: {
        ...goals,
        [goal]: checked
      }
    });
  };

  // Validation - at least one goal must be selected
  const isFormValid = () => {
    return goals && Object.values(goals).some(value => value === true);
  };

  const goalOptions = [
    { id: 'muscleMassGain', label: 'Prise de masse musculaire', description: 'Augmenter votre masse musculaire et votre force' },
    { id: 'weightLoss', label: 'Perte de poids', description: 'Réduire votre poids et votre masse graisseuse' },
    { id: 'flexibilityImprovement', label: 'Amélioration de la souplesse', description: 'Augmenter votre amplitude de mouvement et votre flexibilité' },
    { id: 'cardioImprovement', label: 'Amélioration de la capacité cardio', description: 'Augmenter votre endurance et votre santé cardiovasculaire' },
    { id: 'maintainLevel', label: 'Maintien du niveau de forme actuel', description: 'Conserver votre niveau de forme physique actuel' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brand-primary">Vos Objectifs</h2>
        <p className="text-gray-600 mt-2">Sélectionnez un ou plusieurs objectifs que vous souhaitez atteindre</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="space-y-4">
          {goalOptions.map((goal, index) => (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                goals[goal.id as keyof typeof goals]
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-gray-200 hover:border-brand-primary/30 hover:bg-brand-secondary/10'
              }`}
            >
              <label className="flex items-start cursor-pointer">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    checked={goals[goal.id as keyof typeof goals] || false}
                    onChange={(e) => handleGoalChange(goal.id as keyof NonNullable<UserData['goals']>, e.target.checked)}
                  />
                </div>
                <div className="ml-3">
                  <span className={`text-base font-medium ${
                    goals[goal.id as keyof typeof goals] ? 'text-brand-primary' : 'text-gray-700'
                  }`}>
                    {goal.label}
                  </span>
                  <p className="text-sm text-gray-500">{goal.description}</p>
                </div>
                {goals[goal.id as keyof typeof goals] && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-brand-primary flex-shrink-0" />
                )}
              </label>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="brand-button-outline"
          onClick={onPrevious}
        >
          Retour
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="brand-button"
          onClick={onNext}
          disabled={!isFormValid()}
        >
          Continuer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step2;
