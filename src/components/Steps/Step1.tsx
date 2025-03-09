
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';

// Import the section components
import StrengthSection from './EGym/StrengthSection';
import FlexibilitySection from './EGym/FlexibilitySection';
import MetabolicSection from './EGym/MetabolicSection';
import CardioSection from './EGym/CardioSection';

// Import utility functions
import { getFlexibilityLevel, getLevelValue } from './EGym/FlexibilityUtils';

interface Step1Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step1: React.FC<Step1Props> = ({ userData, updateUserData, onNext, onPrevious }) => {
  // Initialize eGym object if it doesn't exist
  const eGym = userData.eGym || {
    strength: {},
    flexibility: {},
    metabolic: {},
    cardio: {}
  };

  const handleChange = (category: string, subcategory: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    const updatedEGym = {
      ...userData.eGym,
      [category]: {
        ...userData.eGym?.[category as keyof typeof userData.eGym],
        [subcategory]: numValue
      }
    };

    updateUserData({ eGym: updatedEGym });
  };

  const handleFlexibilityLevelChange = (subcategory: string, level: string) => {
    const numValue = getLevelValue(level);
    
    const updatedEGym = {
      ...userData.eGym,
      flexibility: {
        ...userData.eGym?.flexibility,
        [subcategory]: numValue
      }
    };

    updateUserData({ eGym: updatedEGym });
  };

  // Validation - check if at least one value is filled in each category
  const isFormValid = () => {
    const hasStrength = eGym.strength && (
      eGym.strength.upperBody !== undefined || 
      eGym.strength.midBody !== undefined || 
      eGym.strength.lowerBody !== undefined
    );
    
    const hasFlexibility = eGym.flexibility && (
      eGym.flexibility.neck !== undefined ||
      eGym.flexibility.shoulders !== undefined ||
      eGym.flexibility.lumbar !== undefined ||
      eGym.flexibility.hamstrings !== undefined ||
      eGym.flexibility.hips !== undefined
    );
    
    const hasMetabolic = eGym.metabolic && (
      eGym.metabolic.weight !== undefined ||
      eGym.metabolic.fatPercentage !== undefined ||
      eGym.metabolic.muscleMass !== undefined ||
      eGym.metabolic.metabolicAge !== undefined
    );
    
    const hasCardio = eGym.cardio && (
      eGym.cardio.vo2max !== undefined ||
      eGym.cardio.cardioAge !== undefined
    );
    
    return hasStrength && hasFlexibility && hasMetabolic && hasCardio;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brand-primary">Données eGym</h2>
        <p className="text-gray-600 mt-2">Vos résultats des différentes mesures eGym</p>
      </div>

      {/* Force */}
      <StrengthSection eGym={eGym} handleChange={handleChange} />

      {/* Flexibilité */}
      <FlexibilitySection 
        eGym={eGym} 
        handleFlexibilityLevelChange={handleFlexibilityLevelChange} 
        getFlexibilityLevel={getFlexibilityLevel} 
      />

      {/* Métabolique */}
      <MetabolicSection eGym={eGym} handleChange={handleChange} />

      {/* Cardio */}
      <CardioSection eGym={eGym} handleChange={handleChange} />
      
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

export default Step1;
