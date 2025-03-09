
import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserData } from '@/hooks/useUserData';

interface CardioSectionProps {
  eGym: UserData['eGym'];
  handleChange: (category: string, subcategory: string, value: string) => void;
}

const CardioSection: React.FC<CardioSectionProps> = ({ eGym, handleChange }) => {
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
            value={eGym?.cardio?.vo2max || ''}
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
            value={eGym?.cardio?.cardioAge || ''}
            onChange={(e) => handleChange('cardio', 'cardioAge', e.target.value)}
            className="brand-input w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CardioSection;
