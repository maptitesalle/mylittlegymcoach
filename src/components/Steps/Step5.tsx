
import React from 'react';
import { UserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  StretchHorizontal, 
  Weight, 
  Heart, 
  Target, 
  Wheat, 
  Leaf, 
  Egg, 
  Milk, 
  HeartPulse, 
  Activity, 
  Lungs, 
  Thermometer,
  CheckCircle,
  User
} from 'lucide-react';

interface Step5Props {
  userData: UserData;
  onNext: () => void;
  onPrevious: () => void;
}

const Step5: React.FC<Step5Props> = ({ userData, onNext, onPrevious }) => {
  // Formatter pour afficher les données numériques avec 1 décimale si nécessaire
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined) return 'Non renseigné';
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
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
        <h2 className="text-2xl font-semibold text-brand-primary">Récapitulatif</h2>
        <p className="text-gray-600 mt-2">Vérifiez les informations saisies avant de valider</p>
      </div>
      
      {/* Informations de base */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Informations personnelles</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Âge</p>
            <p className="font-medium">{userData.age || 'Non renseigné'} ans</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Genre</p>
            <p className="font-medium">
              {userData.gender === 'male' ? 'Homme' : 
               userData.gender === 'female' ? 'Femme' : 
               userData.gender === 'other' ? 'Autre' : 'Non renseigné'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Taille</p>
            <p className="font-medium">{userData.height || 'Non renseigné'} cm</p>
          </div>
        </div>
      </motion.div>
      
      {/* Force */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Dumbbell className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Force</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Haut du corps</p>
            <p className="font-medium">{formatNumber(userData.eGym?.strength?.upperBody)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Milieu du corps</p>
            <p className="font-medium">{formatNumber(userData.eGym?.strength?.midBody)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Bas du corps</p>
            <p className="font-medium">{formatNumber(userData.eGym?.strength?.lowerBody)}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Flexibilité */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <StretchHorizontal className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Flexibilité</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Cou</p>
            <p className="font-medium">{formatNumber(userData.eGym?.flexibility?.neck)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Épaules</p>
            <p className="font-medium">{formatNumber(userData.eGym?.flexibility?.shoulders)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Lombaires</p>
            <p className="font-medium">{formatNumber(userData.eGym?.flexibility?.lumbar)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Ischios</p>
            <p className="font-medium">{formatNumber(userData.eGym?.flexibility?.hamstrings)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Hanches</p>
            <p className="font-medium">{formatNumber(userData.eGym?.flexibility?.hips)}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Métabolique */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Weight className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Métabolique</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Poids</p>
            <p className="font-medium">{formatNumber(userData.eGym?.metabolic?.weight)} kg</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Pourcentage de masse graisseuse</p>
            <p className="font-medium">{formatNumber(userData.eGym?.metabolic?.fatPercentage)} %</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Masse musculaire</p>
            <p className="font-medium">{formatNumber(userData.eGym?.metabolic?.muscleMass)} kg</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Âge métabolique</p>
            <p className="font-medium">{formatNumber(userData.eGym?.metabolic?.metabolicAge)} ans</p>
          </div>
        </div>
      </motion.div>
      
      {/* Cardio */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Heart className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Cardio</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">VO2max</p>
            <p className="font-medium">{formatNumber(userData.eGym?.cardio?.vo2max)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Âge cardio</p>
            <p className="font-medium">{formatNumber(userData.eGym?.cardio?.cardioAge)} ans</p>
          </div>
        </div>
      </motion.div>
      
      {/* Objectifs */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Objectifs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`flex items-center p-3 rounded-lg ${userData.goals?.muscleMassGain ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            {userData.goals?.muscleMassGain ? 
              <CheckCircle className="h-5 w-5 text-brand-primary mr-2" /> : 
              <div className="h-5 w-5 mr-2" />
            }
            <p className={userData.goals?.muscleMassGain ? 'font-medium text-brand-primary' : 'text-gray-500'}>Prise de masse musculaire</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.goals?.weightLoss ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            {userData.goals?.weightLoss ? 
              <CheckCircle className="h-5 w-5 text-brand-primary mr-2" /> : 
              <div className="h-5 w-5 mr-2" />
            }
            <p className={userData.goals?.weightLoss ? 'font-medium text-brand-primary' : 'text-gray-500'}>Perte de poids</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.goals?.flexibilityImprovement ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            {userData.goals?.flexibilityImprovement ? 
              <CheckCircle className="h-5 w-5 text-brand-primary mr-2" /> : 
              <div className="h-5 w-5 mr-2" />
            }
            <p className={userData.goals?.flexibilityImprovement ? 'font-medium text-brand-primary' : 'text-gray-500'}>Amélioration de la souplesse</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.goals?.cardioImprovement ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            {userData.goals?.cardioImprovement ? 
              <CheckCircle className="h-5 w-5 text-brand-primary mr-2" /> : 
              <div className="h-5 w-5 mr-2" />
            }
            <p className={userData.goals?.cardioImprovement ? 'font-medium text-brand-primary' : 'text-gray-500'}>Amélioration de la capacité cardio</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.goals?.maintainLevel ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            {userData.goals?.maintainLevel ? 
              <CheckCircle className="h-5 w-5 text-brand-primary mr-2" /> : 
              <div className="h-5 w-5 mr-2" />
            }
            <p className={userData.goals?.maintainLevel ? 'font-medium text-brand-primary' : 'text-gray-500'}>Maintien du niveau de forme actuel</p>
          </div>
        </div>
      </motion.div>
      
      {/* Régimes */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Wheat className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Régimes et Contraintes Alimentaires</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`flex items-center p-3 rounded-lg ${userData.diet?.glutenFree ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Wheat className={`h-5 w-5 mr-2 ${userData.diet?.glutenFree ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.diet?.glutenFree ? 'font-medium text-brand-primary' : 'text-gray-500'}>Sans gluten</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.diet?.vegan ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Leaf className={`h-5 w-5 mr-2 ${userData.diet?.vegan ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.diet?.vegan ? 'font-medium text-brand-primary' : 'text-gray-500'}>Vegan</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.diet?.eggFree ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Egg className={`h-5 w-5 mr-2 ${userData.diet?.eggFree ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.diet?.eggFree ? 'font-medium text-brand-primary' : 'text-gray-500'}>Sans œuf</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.diet?.dairyFree ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Milk className={`h-5 w-5 mr-2 ${userData.diet?.dairyFree ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.diet?.dairyFree ? 'font-medium text-brand-primary' : 'text-gray-500'}>Sans produit laitier</p>
          </div>
        </div>
      </motion.div>
      
      {/* Santé */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <HeartPulse className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="text-xl font-medium text-brand-primary">Pathologies / Santé</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className={`flex items-center p-3 rounded-lg ${userData.health?.heartFailure ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <HeartPulse className={`h-5 w-5 mr-2 ${userData.health?.heartFailure ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.health?.heartFailure ? 'font-medium text-brand-primary' : 'text-gray-500'}>Insuffisance cardiaque</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.health?.arthritis ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Activity className={`h-5 w-5 mr-2 ${userData.health?.arthritis ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.health?.arthritis ? 'font-medium text-brand-primary' : 'text-gray-500'}>Arthrose</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.health?.respiratoryProblems ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Lungs className={`h-5 w-5 mr-2 ${userData.health?.respiratoryProblems ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.health?.respiratoryProblems ? 'font-medium text-brand-primary' : 'text-gray-500'}>Problèmes respiratoires</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.health?.obesity ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Weight className={`h-5 w-5 mr-2 ${userData.health?.obesity ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.health?.obesity ? 'font-medium text-brand-primary' : 'text-gray-500'}>Obésité</p>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${userData.health?.hypothyroidism ? 'bg-brand-primary/10' : 'bg-gray-50'}`}>
            <Thermometer className={`h-5 w-5 mr-2 ${userData.health?.hypothyroidism ? 'text-brand-primary' : 'text-gray-400'}`} />
            <p className={userData.health?.hypothyroidism ? 'font-medium text-brand-primary' : 'text-gray-500'}>Hypothyroïdie</p>
          </div>
        </div>
        
        {userData.health?.otherInfo && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Autres informations de santé :</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p>{userData.health.otherInfo}</p>
            </div>
          </div>
        )}
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
        >
          Valider
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step5;
