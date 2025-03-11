
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Wind, 
  Thermometer,
  CheckCircle,
  User,
  Edit2,
  X,
  Save
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Profile: React.FC = () => {
  const { userData, updateUserData } = useUserData();
  const navigate = useNavigate();
  const [editField, setEditField] = React.useState<string | null>(null);
  const [tempValue, setTempValue] = React.useState<any>(null);

  if (!userData || Object.keys(userData).length === 0) {
    return (
      <div className="page-container">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl mb-4">Profil incomplet</h2>
          <p className="text-gray-600 mb-6">
            Vous devez compléter le formulaire d'inscription pour accéder à votre profil.
          </p>
          <Button 
            onClick={() => navigate('/wizard')}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            Compléter mon profil
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = (field: string, value: any) => {
    setEditField(field);
    setTempValue(value);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue(null);
  };

  const handleSave = (category: string, subcategory: string | null = null) => {
    if (subcategory) {
      updateUserData({
        [category]: {
          ...userData[category as keyof typeof userData],
          [subcategory]: tempValue
        }
      });
    } else {
      updateUserData({ [category]: tempValue });
    }
    setEditField(null);
    setTempValue(null);
  };

  const handleBooleanToggle = (category: string, field: string) => {
    const currentValue = userData[category as keyof typeof userData]?.[field];
    updateUserData({
      [category]: {
        ...userData[category as keyof typeof userData],
        [field]: !currentValue
      }
    });
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined) return 'Non renseigné';
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Consultez et modifiez vos données</p>
        </div>

        {/* Informations personnelles */}
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
            <div className="bg-gray-50 p-3 rounded-lg relative group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Âge</p>
                  {editField === 'age' ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-24"
                      />
                      <button onClick={() => handleSave('age')} className="text-green-500">
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">{userData.age || 'Non renseigné'} ans</p>
                  )}
                </div>
                {editField !== 'age' && (
                  <button 
                    onClick={() => handleEdit('age', userData.age)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4 text-brand-primary" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg relative group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Genre</p>
                  {editField === 'gender' ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="brand-input"
                      >
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                        <option value="other">Autre</option>
                      </select>
                      <button onClick={() => handleSave('gender')} className="text-green-500">
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">
                      {userData.gender === 'male' ? 'Homme' : 
                       userData.gender === 'female' ? 'Femme' : 
                       userData.gender === 'other' ? 'Autre' : 'Non renseigné'}
                    </p>
                  )}
                </div>
                {editField !== 'gender' && (
                  <button 
                    onClick={() => handleEdit('gender', userData.gender)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4 text-brand-primary" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg relative group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Taille</p>
                  {editField === 'height' ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-24"
                      />
                      <button onClick={() => handleSave('height')} className="text-green-500">
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">{userData.height || 'Non renseigné'} cm</p>
                  )}
                </div>
                {editField !== 'height' && (
                  <button 
                    onClick={() => handleEdit('height', userData.height)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4 text-brand-primary" />
                  </button>
                )}
              </div>
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
            <div className="bg-gray-50 p-3 rounded-lg relative group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Haut du corps</p>
                  {editField === 'strength.upperBody' ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-24"
                      />
                      <button onClick={() => handleSave('eGym', 'strength')} className="text-green-500">
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">{formatNumber(userData.eGym?.strength?.upperBody)}</p>
                  )}
                </div>
                {editField !== 'strength.upperBody' && (
                  <button 
                    onClick={() => handleEdit('strength.upperBody', userData.eGym?.strength?.upperBody)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4 text-brand-primary" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Similar blocks for midBody and lowerBody */}
            {/* ... use the same pattern as above for other strength measurements */}
          </div>
        </motion.div>

        {/* Objectifs */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-brand-primary mr-2" />
            <h3 className="text-xl font-medium text-brand-primary">Objectifs</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Prise de masse musculaire</span>
              <Switch
                checked={userData.goals?.muscleMassGain || false}
                onCheckedChange={() => handleBooleanToggle('goals', 'muscleMassGain')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Perte de poids</span>
              <Switch
                checked={userData.goals?.weightLoss || false}
                onCheckedChange={() => handleBooleanToggle('goals', 'weightLoss')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Amélioration de la souplesse</span>
              <Switch
                checked={userData.goals?.flexibilityImprovement || false}
                onCheckedChange={() => handleBooleanToggle('goals', 'flexibilityImprovement')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Amélioration cardio</span>
              <Switch
                checked={userData.goals?.cardioImprovement || false}
                onCheckedChange={() => handleBooleanToggle('goals', 'cardioImprovement')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Maintien du niveau</span>
              <Switch
                checked={userData.goals?.maintainLevel || false}
                onCheckedChange={() => handleBooleanToggle('goals', 'maintainLevel')}
              />
            </div>
          </div>
        </motion.div>

        {/* Régimes et Contraintes Alimentaires */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Wheat className="w-5 h-5 text-brand-primary mr-2" />
            <h3 className="text-xl font-medium text-brand-primary">Régimes et Contraintes Alimentaires</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Sans gluten</span>
              <Switch
                checked={userData.diet?.glutenFree || false}
                onCheckedChange={() => handleBooleanToggle('diet', 'glutenFree')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Vegan</span>
              <Switch
                checked={userData.diet?.vegan || false}
                onCheckedChange={() => handleBooleanToggle('diet', 'vegan')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Sans œuf</span>
              <Switch
                checked={userData.diet?.eggFree || false}
                onCheckedChange={() => handleBooleanToggle('diet', 'eggFree')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Sans produit laitier</span>
              <Switch
                checked={userData.diet?.dairyFree || false}
                onCheckedChange={() => handleBooleanToggle('diet', 'dairyFree')}
              />
            </div>
          </div>
        </motion.div>

        {/* Pathologies / Santé */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <HeartPulse className="w-5 h-5 text-brand-primary mr-2" />
            <h3 className="text-xl font-medium text-brand-primary">Pathologies / Santé</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Insuffisance cardiaque</span>
              <Switch
                checked={userData.health?.heartFailure || false}
                onCheckedChange={() => handleBooleanToggle('health', 'heartFailure')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Arthrose</span>
              <Switch
                checked={userData.health?.arthritis || false}
                onCheckedChange={() => handleBooleanToggle('health', 'arthritis')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Problèmes respiratoires</span>
              <Switch
                checked={userData.health?.respiratoryProblems || false}
                onCheckedChange={() => handleBooleanToggle('health', 'respiratoryProblems')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Obésité</span>
              <Switch
                checked={userData.health?.obesity || false}
                onCheckedChange={() => handleBooleanToggle('health', 'obesity')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700">Hypothyroïdie</span>
              <Switch
                checked={userData.health?.hypothyroidism || false}
                onCheckedChange={() => handleBooleanToggle('health', 'hypothyroidism')}
              />
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
      </motion.div>
    </div>
  );
};

export default Profile;
