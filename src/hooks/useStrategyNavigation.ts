
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StrategyState } from '@/types/marketing';
import { stateToSlug } from '@/utils/strategyUrlUtils';

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
   * The new implementation uses URLs for navigation
   */
  const navigateToPreviousStep = useCallback(async (currentState: StrategyState) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }

    try {
      setIsNavigating(true);
      
      // Map current state to previous state
      let previousState: StrategyState;
      
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
        case StrategyState.CHANNEL_STRATEGY:
          previousState = StrategyState.STATEMENTS;
          break;
        case StrategyState.FUNNEL:
          previousState = StrategyState.CHANNEL_STRATEGY;
          break;
        case StrategyState.ROAS_CALCULATOR:
          previousState = StrategyState.FUNNEL;
          break;
        case StrategyState.ADS:
          previousState = StrategyState.ROAS_CALCULATOR;
          break;
        default:
          toast.error('Invalid current state');
          setIsNavigating(false);
          return;
      }

      // Get URL slug for the previous state
      const previousStateSlug = stateToSlug[previousState];
      console.log(`Navigating from ${currentState} to previous state ${previousState} (${previousStateSlug})`);
      
      // Simply navigate to the URL for the previous state
      // The StrategyStageContainer component will handle the database update
      navigate(`/strategy/${strategyId}/${previousStateSlug}`);

      // Notify success
      toast.success(`Navigating to ${previousState}`);
      
    } catch (error: any) {
      console.error('Error in navigateToPreviousStep:', error);
      toast.error(error.message || 'Navigation failed');
    } finally {
      setIsNavigating(false);
    }
  }, [strategyId, navigate]);
  
  /**
   * Navigate to the next step in the strategy workflow
   * The new implementation uses URLs for navigation
   */
  const navigateToNextStep = useCallback(async (currentState: StrategyState) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }

    try {
      setIsNavigating(true);
      
      // Map current state to next state
      let nextState: StrategyState;
      
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
          nextState = StrategyState.CHANNEL_STRATEGY;
          break;
        case StrategyState.CHANNEL_STRATEGY:
          nextState = StrategyState.FUNNEL;
          break;
        case StrategyState.FUNNEL:
          nextState = StrategyState.ROAS_CALCULATOR;
          break;
        case StrategyState.ROAS_CALCULATOR:
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

      // Get URL slug for the next state
      const nextStateSlug = stateToSlug[nextState];
      console.log(`Navigating from ${currentState} to next state ${nextState} (${nextStateSlug})`);
      
      // Simply navigate to the URL for the next state
      // The StrategyStageContainer component will handle the database update
      navigate(`/strategy/${strategyId}/${nextStateSlug}`);

      // Notify success
      toast.success(`Moving to ${nextState} stage`);
      
    } catch (error: any) {
      console.error('Error in navigateToNextStep:', error);
      toast.error(error.message || 'Navigation failed');
    } finally {
      setIsNavigating(false);
    }
  }, [strategyId, navigate]);

  return { 
    navigateToPreviousStep,
    navigateToNextStep,
    isNavigating
  };
};

export default useStrategyNavigation;
