
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
  const navigateToPreviousStep = useCallback(async (currentState: StrategyState) => {
    if (!strategyId) return;
    
    try {
      setIsNavigating(true);
      let previousState: StrategyState;
      
      // Determine the previous state based on the current state
      switch(currentState) {
        case 'funnel':
          previousState = 'pain_gains';
          break;
        case 'pain_gains':
          previousState = 'persona';
          break;
        case 'persona':
          previousState = 'briefing';
          break;
        case 'ads':
          previousState = 'funnel';
          break;
        default:
          previousState = 'briefing';
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
  const navigateToNextStep = useCallback(async (currentState: StrategyState) => {
    if (!strategyId) return;
    
    try {
      setIsNavigating(true);
      let nextState: StrategyState;
      
      // Determine the next state based on the current state
      switch(currentState) {
        case 'briefing':
          nextState = 'persona';
          break;
        case 'persona':
          nextState = 'pain_gains';
          break;
        case 'pain_gains':
          nextState = 'funnel';
          break;
        case 'funnel':
          nextState = 'ads';
          break;
        default:
          nextState = 'briefing';
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
