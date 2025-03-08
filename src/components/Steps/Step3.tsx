
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { Wheat, Leaf, Egg, Milk } from 'lucide-react';

interface Step3Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step3: React.FC<Step3Props> = ({ userData, updateUserData, onNext, onPrevious }) => {
  const diet = userData.diet || {};

  const handleDietChange = (dietKey: keyof NonNullable<UserData['diet']>, checked: boolean) => {
    updateUserData({
      diet: {
        ...diet,
        [dietKey]: checked
      }
    });
  };

  const dietOptions = [
    { 
      id: 'glutenFree', 
      label: 'Sans gluten', 
      description: 'Exclut tous les aliments contenant du gluten (blé, orge, seigle)',
      icon: Wheat
    },
    { 
      id: 'vegan', 
      label: 'Vegan', 
      description: 'Exclut tous les produits d\'origine animale',
      icon: Leaf
    },
    { 
      id: 'eggFree', 
      label: 'Sans œuf', 
      description: 'Exclut les œufs et les produits contenant des œufs',
      icon: Egg
    },
    { 
      id: 'dairyFree', 
      label: 'Sans produit laitier', 
      description: 'Exclut le lait et tous les produits laitiers',
      icon: Milk
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
        <h2 className="text-2xl font-semibold text-brand-primary">Régimes et Contraintes Alimentaires</h2>
        <p className="text-gray-600 mt-2">Sélectionnez les options qui correspondent à vos habitudes alimentaires</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dietOptions.map((dietOption, index) => {
            const Icon = dietOption.icon;
            const isSelected = diet[dietOption.id as keyof typeof diet] || false;
            
            return (
              <motion.div 
                key={dietOption.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                    : 'border-gray-200 hover:border-brand-primary/30 hover:bg-brand-secondary/10'
                }`}
                onClick={() => handleDietChange(
                  dietOption.id as keyof NonNullable<UserData['diet']>,
                  !isSelected
                )}
              >
                <div className="flex items-start cursor-pointer">
                  <div className={`p-2 rounded-full mr-4 ${
                    isSelected ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mr-2"
                        checked={isSelected}
                        onChange={(e) => handleDietChange(
                          dietOption.id as keyof NonNullable<UserData['diet']>,
                          e.target.checked
                        )}
                      />
                      <span className={`text-base font-medium ${
                        isSelected ? 'text-brand-primary' : 'text-gray-700'
                      }`}>
                        {dietOption.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{dietOption.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

export default Step3;
