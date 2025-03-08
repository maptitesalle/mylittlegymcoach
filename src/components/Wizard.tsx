
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserData, UserData } from '@/hooks/useUserData';
import ProgressBar from './ProgressBar';
import Step0 from './Steps/Step0';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import { useToast } from '@/hooks/use-toast';

const Wizard: React.FC = () => {
  const { userData, updateUserData } = useUserData();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 6; // 0-5
  
  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishWizard();
    }
  };
  
  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const finishWizard = () => {
    toast({
      title: "Données enregistrées",
      description: "Vos données ont été sauvegardées avec succès.",
      duration: 3000,
    });
    
    // Rediriger vers le dashboard après un court délai
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step0 userData={userData} updateUserData={updateUserData} onNext={nextStep} />;
      case 1:
        return <Step1 userData={userData} updateUserData={updateUserData} onNext={nextStep} onPrevious={previousStep} />;
      case 2:
        return <Step2 userData={userData} updateUserData={updateUserData} onNext={nextStep} onPrevious={previousStep} />;
      case 3:
        return <Step3 userData={userData} updateUserData={updateUserData} onNext={nextStep} onPrevious={previousStep} />;
      case 4:
        return <Step4 userData={userData} updateUserData={updateUserData} onNext={nextStep} onPrevious={previousStep} />;
      case 5:
        return <Step5 userData={userData} onNext={nextStep} onPrevious={previousStep} />;
      default:
        return <Step0 userData={userData} updateUserData={updateUserData} onNext={nextStep} />;
    }
  };

  return (
    <div className="page-container">
      <ProgressBar currentStep={step + 1} totalSteps={totalSteps} />
      
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Wizard;
