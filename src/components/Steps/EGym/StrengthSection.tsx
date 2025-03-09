
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserData } from '@/hooks/useUserData';

interface StrengthSectionProps {
  eGym: UserData['eGym'];
  handleChange: (category: string, subcategory: string, value: string) => void;
}

const StrengthSection: React.FC<StrengthSectionProps> = ({ eGym, handleChange }) => {
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
            value={eGym?.strength?.upperBody || ''}
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
            value={eGym?.strength?.midBody || ''}
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
            value={eGym?.strength?.lowerBody || ''}
            onChange={(e) => handleChange('strength', 'lowerBody', e.target.value)}
            placeholder="Exemple : 30"
            className="brand-input w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthSection;
