
import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { userData } = useUserData();

  if (!userData) {
    // Handle case when no user data is available
    return (
      <div className="page-container">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl mb-4">Aucune donnée disponible</h2>
          <p className="text-gray-600 mb-6">
            Vous devez compléter le formulaire d'inscription pour accéder à votre dashboard personnalisé.
          </p>
          <a href="/" className="brand-button inline-block">
            Remplir le formulaire
          </a>
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
          <h1 className="text-3xl font-bold mb-2">Votre Dashboard Personnalisé</h1>
          <p className="text-gray-600">
            Bienvenue ! Voici vos recommandations personnalisées basées sur vos données.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Dashboard sections will go here */}
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
