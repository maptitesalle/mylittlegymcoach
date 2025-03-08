
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';

interface Step0Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const Step0: React.FC<Step0Props> = ({ userData, updateUserData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const numValue = type === 'number' ? parseFloat(value) : value;
    
    updateUserData({ [name]: numValue });
  };

  const isFormValid = () => {
    return (
      userData.age !== undefined && 
      userData.gender !== undefined && 
      userData.height !== undefined
    );
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
        <h2 className="text-2xl font-semibold text-brand-primary">Informations de base</h2>
        <p className="text-gray-600 mt-2">Commençons par quelques informations générales</p>
      </div>
      
      <div className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Âge
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={userData.age || ''}
              onChange={handleChange}
              placeholder="Votre âge"
              min="0"
              max="120"
              className="brand-input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              id="gender"
              name="gender"
              value={userData.gender || ''}
              onChange={handleChange}
              className="brand-input w-full"
              required
            >
              <option value="" disabled>Sélectionnez votre genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Taille (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={userData.height || ''}
              onChange={handleChange}
              placeholder="Votre taille en centimètres"
              min="0"
              max="250"
              className="brand-input w-full"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
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

export default Step0;
