
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/wizard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">
            Bienvenue à Ma P'tite Salle
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Votre coach personnel pour optimiser votre parcours fitness
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Recevez des conseils personnalisés sur la nutrition, les compléments, 
            la souplesse et les activités de gym en fonction de vos besoins et objectifs.
          </p>
          
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-6 text-lg"
          >
            {user ? 'Commencer' : 'Se connecter'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold text-brand-primary mb-3">Nutrition Personnalisée</h3>
            <p className="text-gray-600">Obtenez des recommandations adaptées à vos objectifs et contraintes alimentaires.</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold text-brand-primary mb-3">Programme d'Exercices</h3>
            <p className="text-gray-600">Découvrez les exercices les plus efficaces pour votre morphologie et vos objectifs.</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold text-brand-primary mb-3">Suivi de Progression</h3>
            <p className="text-gray-600">Visualisez votre évolution et restez motivé tout au long de votre parcours.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
