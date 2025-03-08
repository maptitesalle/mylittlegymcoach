
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { HeartPulse, Activity, Lungs, Weight, Thermometer } from 'lucide-react';

interface Step4Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step4: React.FC<Step4Props> = ({ userData, updateUserData, onNext, onPrevious }) => {
  const health = userData.health || {};

  const handleHealthChange = (healthKey: keyof NonNullable<UserData['health']>, checked: boolean) => {
    updateUserData({
      health: {
        ...health,
        [healthKey]: checked
      }
    });
  };

  const handleOtherInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserData({
      health: {
        ...health,
        otherInfo: e.target.value
      }
    });
  };

  const healthOptions = [
    { 
      id: 'heartFailure', 
      label: 'Insuffisance cardiaque', 
      icon: HeartPulse 
    },
    { 
      id: 'arthritis', 
      label: 'Arthrose', 
      icon: Activity 
    },
    { 
      id: 'respiratoryProblems', 
      label: 'Problèmes respiratoires', 
      icon: Lungs 
    },
    { 
      id: 'obesity', 
      label: 'Obésité', 
      icon: Weight 
    },
    { 
      id: 'hypothyroidism', 
      label: 'Hypothyroïdie', 
      icon: Thermometer 
    }
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
        <h2 className="text-2xl font-semibold text-brand-primary">Pathologies / Santé</h2>
        <p className="text-gray-600 mt-2">Indiquez les informations médicales pertinentes pour adapter vos recommandations</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {healthOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = health[option.id as keyof typeof health] || false;
            
            return (
              <motion.div 
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10'
                    : 'border-gray-200 hover:border-brand-primary/30 hover:bg-brand-secondary/10'
                }`}
              >
                <label className="flex items-center cursor-pointer">
                  <div className={`p-2 rounded-full mr-3 ${
                    isSelected ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mr-2"
                      checked={isSelected}
                      onChange={(e) => handleHealthChange(
                        option.id as keyof NonNullable<UserData['health']>,
                        e.target.checked
                      )}
                    />
                    <span className={`text-base ${
                      isSelected ? 'text-brand-primary font-medium' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </label>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6">
          <label htmlFor="otherInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Autres informations de santé
          </label>
          <textarea
            id="otherInfo"
            rows={4}
            placeholder="Ex: cholestérol élevé, anémie, etc."
            className="brand-input w-full"
            value={health.otherInfo || ''}
            onChange={handleOtherInfoChange}
          />
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
        >
          Continuer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step4;
