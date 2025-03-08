
import { useState, useEffect } from 'react';

export interface UserData {
  // Étape 0
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;

  // Étape 1 - Données eGym
  eGym?: {
    strength?: {
      upperBody?: number;
      midBody?: number;
      lowerBody?: number;
    };
    flexibility?: {
      neck?: number;
      shoulders?: number;
      lumbar?: number;
      hamstrings?: number;
      hips?: number;
    };
    metabolic?: {
      weight?: number;
      fatPercentage?: number;
      muscleMass?: number;
      metabolicAge?: number;
    };
    cardio?: {
      vo2max?: number;
      cardioAge?: number;
    };
  };

  // Étape 2 - Objectifs
  goals?: {
    muscleMassGain?: boolean;
    weightLoss?: boolean;
    flexibilityImprovement?: boolean;
    cardioImprovement?: boolean;
    maintainLevel?: boolean;
  };

  // Étape 3 - Régimes et Contraintes Alimentaires
  diet?: {
    glutenFree?: boolean;
    vegan?: boolean;
    eggFree?: boolean;
    dairyFree?: boolean;
  };

  // Étape 4 - Pathologies / Santé
  health?: {
    heartFailure?: boolean;
    arthritis?: boolean;
    respiratoryProblems?: boolean;
    obesity?: boolean;
    hypothyroidism?: boolean;
    otherInfo?: string;
  };
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : {};
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prevData => ({ ...prevData, ...newData }));
  };

  const clearUserData = () => {
    setUserData({});
    localStorage.removeItem('userData');
  };

  return {
    userData,
    updateUserData,
    clearUserData,
    loading
  };
}
