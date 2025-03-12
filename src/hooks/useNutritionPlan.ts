
import { useState, useEffect, useRef } from 'react';
import { UserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { useNutritionPolling } from './nutrition/useNutritionPolling';
import { useExistingPlan } from './nutrition/useExistingPlan';
import { usePlanGeneration } from './nutrition/usePlanGeneration';

export function useNutritionPlan(userData: UserData) {
  const [nutritionPlan, setNutritionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const nutritionPlanRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { pollingInterval, startPolling } = useNutritionPolling();
  const { fetchUserLatestPlan, checkExistingPlan } = useExistingPlan();
  const { previousRecipes, generateNutritionPlan: generatePlan } = usePlanGeneration();

  useEffect(() => {
    const savedRequestId = localStorage.getItem('nutritionPlanRequestId');
    if (savedRequestId && user) {
      setCurrentRequestId(savedRequestId);
      checkExistingPlan(
        savedRequestId, 
        user.id, 
        setNutritionPlan, 
        setLoading,
        startPolling
      );
    } else if (user) {
      fetchUserLatestPlan(user.id, setNutritionPlan);
    }
  }, [user]);

  const generateNutritionPlan = async (regenerate = false) => {
    if (!user || !user.id) return;
    
    await generatePlan(
      regenerate,
      userData,
      user.id,
      nutritionPlan,
      setNutritionPlan,
      setLoading,
      setRegenerating,
      setCurrentRequestId,
      startPolling
    );
  };

  return {
    nutritionPlan,
    setNutritionPlan,
    loading,
    regenerating,
    nutritionPlanRef,
    generateNutritionPlan
  };
}
