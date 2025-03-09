
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { Dumbbell, StretchHorizontal, Weight, Heart, ThumbsDown, Hand, ThumbsUp } from 'lucide-react';

interface Step1Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Function to determine flexibility level based on value
const getFlexibilityLevel = (value: number | undefined) => {
  if (!value) return null;
  
  if (value < 30) return 'faible';
  if (value >= 30 && value < 70) return 'normal';
  return 'excellent';
};

// Function to get icon based on level
const getFlexibilityIcon = (level: string | null) => {
  if (!level) return null;
  
  switch (level) {
    case 'faible':
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    case 'normal':
      return <Hand className="h-5 w-5 text-amber-500" />;
    case 'excellent':
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

// Function to get the numeric value from a level
const getLevelValue = (level: string | null): number => {
  if (!level) return 0;
  
  switch (level) {
    case 'faible':
      return 15; // Moyenne de la plage "faible"
    case 'normal':
      return 50; // Moyenne de la plage "normal"
    case 'excellent':
      return 85; // Moyenne de la plage "excellent"
    default:
      return 0;
  }
};

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cou
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('neck', 'faible')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.neck) === 'faible' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faible
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('neck', 'normal')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.neck) === 'normal' 
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Hand className="h-4 w-4 mr-1" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('neck', 'excellent')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.neck) === 'excellent' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Excellent
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Épaules
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('shoulders', 'faible')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.shoulders) === 'faible' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faible
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('shoulders', 'normal')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.shoulders) === 'normal' 
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Hand className="h-4 w-4 mr-1" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('shoulders', 'excellent')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.shoulders) === 'excellent' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Excellent
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lombaires
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('lumbar', 'faible')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.lumbar) === 'faible' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faible
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('lumbar', 'normal')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.lumbar) === 'normal' 
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Hand className="h-4 w-4 mr-1" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('lumbar', 'excellent')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.lumbar) === 'excellent' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Excellent
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ischios
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hamstrings', 'faible')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hamstrings) === 'faible' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faible
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hamstrings', 'normal')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hamstrings) === 'normal' 
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Hand className="h-4 w-4 mr-1" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hamstrings', 'excellent')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hamstrings) === 'excellent' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Excellent
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hanches
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hips', 'faible')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hips) === 'faible' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faible
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hips', 'normal')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hips) === 'normal' 
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Hand className="h-4 w-4 mr-1" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFlexibilityLevelChange('hips', 'excellent')}
                className={`flex items-center px-3 py-2 rounded-md border ${
                  getFlexibilityLevel(eGym.flexibility?.hips) === 'excellent' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Excellent
              </button>
            </div>
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
