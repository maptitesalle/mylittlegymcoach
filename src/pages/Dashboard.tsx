
import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();

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

        <div className="grid gap-8 md:grid-cols-2">
          <div className="glass-card p-6">
            <h3 className="text-xl font-medium text-brand-primary mb-4">Nutrition</h3>
            <p className="text-gray-600">Les recommandations nutritionnelles seront affichées ici.</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-medium text-brand-primary mb-4">Compléments</h3>
            <p className="text-gray-600">Les recommandations de compléments seront affichées ici.</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-medium text-brand-primary mb-4">Souplesse</h3>
            <p className="text-gray-600">Les conseils pour améliorer votre souplesse seront affichés ici.</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-medium text-brand-primary mb-4">Sport à la salle</h3>
            <p className="text-gray-600">Les recommandations d'exercices en salle seront affichées ici.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
