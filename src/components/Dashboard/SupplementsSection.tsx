
import React, { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';
import { UserData } from '@/hooks/useUserData';
import { generateSupplementsAdvice } from '@/lib/aiService';
import { motion } from 'framer-motion';

interface SupplementsSectionProps {
  userData: UserData;
}

const SupplementsSection: React.FC<SupplementsSectionProps> = ({ userData }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const supplementsAdvice = await generateSupplementsAdvice(userData);
        setAdvice(supplementsAdvice);
      } catch (error) {
        console.error('Erreur lors de la génération des conseils sur les compléments:', error);
        setAdvice('Une erreur est survenue lors de la génération des conseils sur les compléments. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [userData]);

  // Split advice into paragraphs
  const paragraphs = advice.split('\n').filter(p => p.trim() !== '');

  return (
    <motion.div 
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-6 border-b border-brand-secondary">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center mr-4">
            <Pill className="w-5 h-5 text-brand-primary" />
          </div>
          <h3 className="text-xl font-medium text-brand-primary">Compléments</h3>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <motion.p 
                key={index} 
                className="text-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SupplementsSection;
