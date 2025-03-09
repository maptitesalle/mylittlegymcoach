
import React from 'react';
import { StretchHorizontal, ThumbsDown, Hand, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserData } from '@/hooks/useUserData';

interface FlexibilitySectionProps {
  eGym: UserData['eGym'];
  handleFlexibilityLevelChange: (subcategory: string, level: string) => void;
  getFlexibilityLevel: (value: number | undefined) => string | null;
}

const FlexibilitySection: React.FC<FlexibilitySectionProps> = ({ 
  eGym, 
  handleFlexibilityLevelChange, 
  getFlexibilityLevel 
}) => {
  return (
    <motion.div 
      className="glass-card p-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (custom: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: custom * 0.1, duration: 0.5 }
        })
      }}
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
                getFlexibilityLevel(eGym?.flexibility?.neck) === 'faible' 
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
                getFlexibilityLevel(eGym?.flexibility?.neck) === 'normal' 
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
                getFlexibilityLevel(eGym?.flexibility?.neck) === 'excellent' 
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
                getFlexibilityLevel(eGym?.flexibility?.shoulders) === 'faible' 
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
                getFlexibilityLevel(eGym?.flexibility?.shoulders) === 'normal' 
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
                getFlexibilityLevel(eGym?.flexibility?.shoulders) === 'excellent' 
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
                getFlexibilityLevel(eGym?.flexibility?.lumbar) === 'faible' 
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
                getFlexibilityLevel(eGym?.flexibility?.lumbar) === 'normal' 
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
                getFlexibilityLevel(eGym?.flexibility?.lumbar) === 'excellent' 
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
                getFlexibilityLevel(eGym?.flexibility?.hamstrings) === 'faible' 
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
                getFlexibilityLevel(eGym?.flexibility?.hamstrings) === 'normal' 
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
                getFlexibilityLevel(eGym?.flexibility?.hamstrings) === 'excellent' 
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
                getFlexibilityLevel(eGym?.flexibility?.hips) === 'faible' 
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
                getFlexibilityLevel(eGym?.flexibility?.hips) === 'normal' 
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
                getFlexibilityLevel(eGym?.flexibility?.hips) === 'excellent' 
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
  );
};

export default FlexibilitySection;
