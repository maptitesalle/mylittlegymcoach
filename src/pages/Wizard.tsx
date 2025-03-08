
import React from 'react';
import WizardComponent from '@/components/Wizard';
import { motion } from 'framer-motion';

const WizardPage: React.FC = () => {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-4">
            Configuration de Votre Profil
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Saisissez vos données sportives, vos objectifs et vos préférences pour obtenir des 
            conseils personnalisés sur la nutrition, les compléments, la souplesse et les activités de gym.
          </p>
        </div>
        
        <WizardComponent />
      </motion.div>
    </div>
  );
};

export default WizardPage;
