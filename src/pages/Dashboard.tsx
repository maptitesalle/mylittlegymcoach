import React, { useState } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ThumbsDown, 
  Hand, 
  ThumbsUp,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import NutritionSection from '@/components/Dashboard/NutritionSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Function to determine flexibility level based on value
const getFlexibilityLevel = (value: number | undefined) => {
  if (!value) return null;
  
  if (value < 30) return 'faible';
  if (value >= 30 && value < 70) return 'normal';
  return 'excellent';
};

// Function to get icon based on level
const getFlexibilityIcon = (level: string | null) => {
  if (!level) return null;
  
  switch (level) {
    case 'faible':
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    case 'normal':
      return <Hand className="h-5 w-5 text-amber-500" />;
    case 'excellent':
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

const Dashboard: React.FC = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nutrition");

  if (!userData || Object.keys(userData).length === 0) {
    return (
      <div className="page-container">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl mb-4">Profil incomplet</h2>
          <p className="text-gray-600 mb-6">
            Vous devez compléter le formulaire d'inscription pour accéder à votre tableau de bord personnalisé.
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

  // Get flexibility data
  const flexibilityData = userData.eGym?.flexibility;

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Votre Tableau de Bord Personnalisé</h1>
          <p className="text-gray-600">
            Bienvenue ! Voici vos recommandations personnalisées basées sur vos données.
          </p>
        </div>

        <Tabs defaultValue="nutrition" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="supplements">Compléments</TabsTrigger>
            <TabsTrigger value="flexibility">Souplesse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nutrition" className="space-y-4">
            <NutritionSection userData={userData} />
          </TabsContent>
          
          <TabsContent value="supplements" className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-xl font-medium text-brand-primary mb-4">Compléments</h3>
              <p className="text-gray-600">Les recommandations de compléments seront affichées ici.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="flexibility" className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-xl font-medium text-brand-primary mb-4">Souplesse</h3>
              {flexibilityData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">Zone</span>
                    <span className="font-medium">Niveau</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Cou</span>
                    <div className="flex items-center space-x-2">
                      {getFlexibilityIcon(getFlexibilityLevel(flexibilityData.neck))}
                      <span className={`
                        ${getFlexibilityLevel(flexibilityData.neck) === 'faible' ? 'text-red-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.neck) === 'normal' ? 'text-amber-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.neck) === 'excellent' ? 'text-green-500' : ''}
                      `}>
                        {getFlexibilityLevel(flexibilityData.neck) || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Épaules</span>
                    <div className="flex items-center space-x-2">
                      {getFlexibilityIcon(getFlexibilityLevel(flexibilityData.shoulders))}
                      <span className={`
                        ${getFlexibilityLevel(flexibilityData.shoulders) === 'faible' ? 'text-red-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.shoulders) === 'normal' ? 'text-amber-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.shoulders) === 'excellent' ? 'text-green-500' : ''}
                      `}>
                        {getFlexibilityLevel(flexibilityData.shoulders) || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Lombaires</span>
                    <div className="flex items-center space-x-2">
                      {getFlexibilityIcon(getFlexibilityLevel(flexibilityData.lumbar))}
                      <span className={`
                        ${getFlexibilityLevel(flexibilityData.lumbar) === 'faible' ? 'text-red-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.lumbar) === 'normal' ? 'text-amber-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.lumbar) === 'excellent' ? 'text-green-500' : ''}
                      `}>
                        {getFlexibilityLevel(flexibilityData.lumbar) || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Ischios</span>
                    <div className="flex items-center space-x-2">
                      {getFlexibilityIcon(getFlexibilityLevel(flexibilityData.hamstrings))}
                      <span className={`
                        ${getFlexibilityLevel(flexibilityData.hamstrings) === 'faible' ? 'text-red-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.hamstrings) === 'normal' ? 'text-amber-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.hamstrings) === 'excellent' ? 'text-green-500' : ''}
                      `}>
                        {getFlexibilityLevel(flexibilityData.hamstrings) || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Hanches</span>
                    <div className="flex items-center space-x-2">
                      {getFlexibilityIcon(getFlexibilityLevel(flexibilityData.hips))}
                      <span className={`
                        ${getFlexibilityLevel(flexibilityData.hips) === 'faible' ? 'text-red-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.hips) === 'normal' ? 'text-amber-500' : ''}
                        ${getFlexibilityLevel(flexibilityData.hips) === 'excellent' ? 'text-green-500' : ''}
                      `}>
                        {getFlexibilityLevel(flexibilityData.hips) || 'Non défini'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Données de souplesse non disponibles.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
