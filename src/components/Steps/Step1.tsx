
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { Dumbbell, StretchHorizontal, Weight, Heart } from 'lucide-react';

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

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
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
      <motion.div 
        className="glass-card p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="flex items-center mb-4">
          <Dumbbell className="w-6 h-6 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Force</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="upperBody" className="block text-sm font-medium text-gray-700 mb-1">
              Haut du corps
            </label>
            <input
              type="number"
              id="upperBody"
              value={eGym.strength?.upperBody || ''}
              onChange={(e) => handleChange('strength', 'upperBody', e.target.value)}
              placeholder="Exemple : 35"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="midBody" className="block text-sm font-medium text-gray-700 mb-1">
              Milieu du corps
            </label>
            <input
              type="number"
              id="midBody"
              value={eGym.strength?.midBody || ''}
              onChange={(e) => handleChange('strength', 'midBody', e.target.value)}
              placeholder="Exemple : 40"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="lowerBody" className="block text-sm font-medium text-gray-700 mb-1">
              Bas du corps
            </label>
            <input
              type="number"
              id="lowerBody"
              value={eGym.strength?.lowerBody || ''}
              onChange={(e) => handleChange('strength', 'lowerBody', e.target.value)}
              placeholder="Exemple : 30"
              className="brand-input w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Flexibilité */}
      <motion.div 
        className="glass-card p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="flex items-center mb-4">
          <StretchHorizontal className="w-6 h-6 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Flexibilité</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="neck" className="block text-sm font-medium text-gray-700 mb-1">
              Cou
            </label>
            <input
              type="number"
              id="neck"
              value={eGym.flexibility?.neck || ''}
              onChange={(e) => handleChange('flexibility', 'neck', e.target.value)}
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="shoulders" className="block text-sm font-medium text-gray-700 mb-1">
              Épaules
            </label>
            <input
              type="number"
              id="shoulders"
              value={eGym.flexibility?.shoulders || ''}
              onChange={(e) => handleChange('flexibility', 'shoulders', e.target.value)}
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="lumbar" className="block text-sm font-medium text-gray-700 mb-1">
              Lombaires
            </label>
            <input
              type="number"
              id="lumbar"
              value={eGym.flexibility?.lumbar || ''}
              onChange={(e) => handleChange('flexibility', 'lumbar', e.target.value)}
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="hamstrings" className="block text-sm font-medium text-gray-700 mb-1">
              Ischios
            </label>
            <input
              type="number"
              id="hamstrings"
              value={eGym.flexibility?.hamstrings || ''}
              onChange={(e) => handleChange('flexibility', 'hamstrings', e.target.value)}
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">
              Hanches
            </label>
            <input
              type="number"
              id="hips"
              value={eGym.flexibility?.hips || ''}
              onChange={(e) => handleChange('flexibility', 'hips', e.target.value)}
              className="brand-input w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Métabolique */}
      <motion.div 
        className="glass-card p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="flex items-center mb-4">
          <Weight className="w-6 h-6 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Métabolique</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Poids (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={eGym.metabolic?.weight || ''}
              onChange={(e) => handleChange('metabolic', 'weight', e.target.value)}
              step="0.1"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="fatPercentage" className="block text-sm font-medium text-gray-700 mb-1">
              Pourcentage de masse graisseuse (%)
            </label>
            <input
              type="number"
              id="fatPercentage"
              value={eGym.metabolic?.fatPercentage || ''}
              onChange={(e) => handleChange('metabolic', 'fatPercentage', e.target.value)}
              step="0.1"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-1">
              Masse musculaire (kg)
            </label>
            <input
              type="number"
              id="muscleMass"
              value={eGym.metabolic?.muscleMass || ''}
              onChange={(e) => handleChange('metabolic', 'muscleMass', e.target.value)}
              step="0.1"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="metabolicAge" className="block text-sm font-medium text-gray-700 mb-1">
              Âge métabolique
            </label>
            <input
              type="number"
              id="metabolicAge"
              value={eGym.metabolic?.metabolicAge || ''}
              onChange={(e) => handleChange('metabolic', 'metabolicAge', e.target.value)}
              className="brand-input w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Cardio */}
      <motion.div 
        className="glass-card p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <div className="flex items-center mb-4">
          <Heart className="w-6 h-6 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Cardio</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vo2max" className="block text-sm font-medium text-gray-700 mb-1">
              VO2max
            </label>
            <input
              type="number"
              id="vo2max"
              value={eGym.cardio?.vo2max || ''}
              onChange={(e) => handleChange('cardio', 'vo2max', e.target.value)}
              step="0.1"
              className="brand-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="cardioAge" className="block text-sm font-medium text-gray-700 mb-1">
              Âge cardio
            </label>
            <input
              type="number"
              id="cardioAge"
              value={eGym.cardio?.cardioAge || ''}
              onChange={(e) => handleChange('cardio', 'cardioAge', e.target.value)}
              className="brand-input w-full"
            />
          </div>
        </div>
      </motion.div>
      
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
