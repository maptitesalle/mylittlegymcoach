
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-brand-primary font-medium">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-sm text-brand-primary font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-brand-secondary rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-brand-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
