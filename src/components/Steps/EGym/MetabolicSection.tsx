
import React from 'react';
import { Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserData } from '@/hooks/useUserData';

interface MetabolicSectionProps {
  eGym: UserData['eGym'];
  handleChange: (category: string, subcategory: string, value: string) => void;
}

const MetabolicSection: React.FC<MetabolicSectionProps> = ({ eGym, handleChange }) => {
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
            value={eGym?.metabolic?.weight || ''}
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
            value={eGym?.metabolic?.fatPercentage || ''}
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
            value={eGym?.metabolic?.muscleMass || ''}
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
            value={eGym?.metabolic?.metabolicAge || ''}
            onChange={(e) => handleChange('metabolic', 'metabolicAge', e.target.value)}
            className="brand-input w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MetabolicSection;
