
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StrategyState } from '@/types/marketing';

type StrategyNavigationOptions = {
  strategyId?: string;
  onRefetch?: () => void;
};

/**
 * Custom hook for handling strategy navigation
 */
export const useStrategyNavigation = (
  { strategyId, onRefetch }: StrategyNavigationOptions
) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  
  /**
   * Navigate to the previous step in the strategy workflow
   */
  const navigateToPreviousStep = useCallback(async (currentState: string) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }

    try {
      setIsNavigating(true);
      
      // Map current state to previous state
      let previousState: string;
      
      switch (currentState) {
        case StrategyState.PERSONA:
          previousState = StrategyState.BRIEFING;
          break;
        case StrategyState.PAIN_GAINS:
          previousState = StrategyState.PERSONA;
          break;
        case StrategyState.STATEMENTS:
          previousState = StrategyState.PAIN_GAINS;
          break;
        case StrategyState.FUNNEL:
          previousState = StrategyState.STATEMENTS;
          break;
        case StrategyState.ADS:
          previousState = StrategyState.FUNNEL;
          break;
        default:
          toast.error('Invalid current state');
          setIsNavigating(false);
          return;
      }

      // Update the strategy state in the database
      const { error } = await supabase
        .from('strategies')
        .update({ state: previousState })
        .eq('id', strategyId);

      if (error) {
        console.error('Error updating strategy state:', error);
        toast.error('Failed to navigate to previous step');
        return;
      }

      // Notify success
      toast.success(`Navigated back to ${previousState}`);
      
      // Refresh data if callback provided
      if (onRefetch) {
        onRefetch();
      }
    } catch (error: any) {
      console.error('Error in navigateToPreviousStep:', error);
      toast.error(error.message || 'Navigation failed');
    } finally {
      setIsNavigating(false);
    }
  }, [strategyId, onRefetch]);
  
  /**
   * Navigate to the next step in the strategy workflow
   */
  const navigateToNextStep = useCallback(async (currentState: string) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }

    try {
      setIsNavigating(true);
      
      // Map current state to next state
      let nextState: string;
      
      switch (currentState) {
        case StrategyState.BRIEFING:
          nextState = StrategyState.PERSONA;
          break;
        case StrategyState.PERSONA:
          nextState = StrategyState.PAIN_GAINS;
          break;
        case StrategyState.PAIN_GAINS:
          nextState = StrategyState.STATEMENTS;
          break;
        case StrategyState.STATEMENTS:
          nextState = StrategyState.FUNNEL;
          break;
        case StrategyState.FUNNEL:
          nextState = StrategyState.ADS;
          break;
        case StrategyState.ADS:
          nextState = StrategyState.COMPLETED;
          break;
        default:
          toast.error('Invalid current state');
          setIsNavigating(false);
          return;
      }

      // Update the strategy state in the database
      const { error } = await supabase
        .from('strategies')
        .update({ state: nextState })
        .eq('id', strategyId);

      if (error) {
        console.error('Error updating strategy state:', error);
        toast.error('Failed to navigate to next step');
        return;
      }

      // Notify success
      toast.success(`Moved to ${nextState} stage`);
      
      // Refresh data if callback provided
      if (onRefetch) {
        onRefetch();
      }
    } catch (error: any) {
      console.error('Error in navigateToNextStep:', error);
      toast.error(error.message || 'Navigation failed');
    } finally {
      setIsNavigating(false);
    }
  }, [strategyId, onRefetch]);

  return { 
    navigateToPreviousStep,
    navigateToNextStep,
    isNavigating
  };
};

export default useStrategyNavigation;
