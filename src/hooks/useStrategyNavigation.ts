
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StrategyState } from "@/types/marketing";
import { getStateLabel } from "@/utils/strategyUtils";

interface UseStrategyNavigationProps {
  strategyId?: string;
  onRefetch: () => void;
}

export const useStrategyNavigation = ({ strategyId, onRefetch }: UseStrategyNavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);

  /**
   * Navigate to previous state in the strategy flow
   */
  const navigateToPreviousStep = useCallback(async (currentState: StrategyState | string) => {
    if (!strategyId) return;
    
    try {
      setIsNavigating(true);
      let previousState: StrategyState;
      
      // Determine the previous state based on the current state
      switch(currentState) {
        case StrategyState.FUNNEL:
          previousState = StrategyState.PAIN_GAINS;
          break;
        case StrategyState.PAIN_GAINS:
          previousState = StrategyState.PERSONA;
          break;
        case StrategyState.PERSONA:
          previousState = StrategyState.BRIEFING;
          break;
        case StrategyState.ADS:
          previousState = StrategyState.FUNNEL;
          break;
        default:
          previousState = StrategyState.BRIEFING;
      }
      
      console.log(`Going back from ${currentState} to ${previousState}`);
      
      // Update the strategy state
      const { error } = await supabase
        .from('strategies')
        .update({ state: previousState })
        .eq('id', strategyId)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error(`Failed to go back to ${getStateLabel(previousState)} stage`);
        return;
      }
      
      toast.success(`Returned to ${getStateLabel(previousState)} stage`);
      onRefetch(); // Refresh the data
      
    } catch (err) {
      console.error("Failed to go back to previous step:", err);
      toast.error("Failed to navigate back");
    } finally {
      setIsNavigating(false);
    }
  }, [strategyId, onRefetch]);

  /**
   * Navigate to next state in the strategy flow
   */
  const navigateToNextStep = useCallback(async (currentState: StrategyState | string) => {
    if (!strategyId) return;
    
    try {
      setIsNavigating(true);
      let nextState: StrategyState;
      
      // Determine the next state based on the current state
      switch(currentState) {
        case StrategyState.BRIEFING:
          nextState = StrategyState.PERSONA;
          break;
        case StrategyState.PERSONA:
          nextState = StrategyState.PAIN_GAINS;
          break;
        case StrategyState.PAIN_GAINS:
          nextState = StrategyState.FUNNEL;
          break;
        case StrategyState.FUNNEL:
          nextState = StrategyState.ADS;
          break;
        default:
          nextState = StrategyState.BRIEFING;
      }
      
      console.log(`Moving forward from ${currentState} to ${nextState}`);
      
      // Update the strategy state
      const { error } = await supabase
        .from('strategies')
        .update({ state: nextState })
        .eq('id', strategyId)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error(`Failed to advance to ${getStateLabel(nextState)} stage`);
        return;
      }
      
      toast.success(`Advanced to ${getStateLabel(nextState)} stage`);
      onRefetch(); // Refresh the data
      
    } catch (err) {
      console.error("Failed to advance to next step:", err);
      toast.error("Failed to navigate forward");
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
