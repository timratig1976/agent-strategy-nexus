
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Strategy, StrategyState } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugToState, stateToSlug } from "@/utils/strategyUrlUtils";
import { stateToDbMap } from "@/utils/strategyUtils";

interface StrategyStageSyncOptions {
  /**
   * Strategy ID from URL params
   */
  id?: string;
  
  /**
   * Current stage slug from URL params
   */
  stageSlug?: string;
  
  /**
   * Strategy data object
   */
  strategy?: Strategy | null;
  
  /**
   * Function to refetch strategy data
   */
  refetch?: () => void;
}

/**
 * Custom hook that handles synchronization between URL stage and database strategy state
 * 
 * This ensures the URL and the database state are consistent and handles navigation restrictions
 */
export const useStrategyStageSynchronization = ({
  id,
  stageSlug,
  strategy,
  refetch
}: StrategyStageSyncOptions) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    // Skip if we don't have necessary data
    if (!id || !stageSlug || !strategy) return;
    
    // Map the URL slug to a strategy state (like briefing -> StrategyState.BRIEFING)
    const urlState = slugToState[stageSlug];
    
    // If we can't map the slug to a state, it's an invalid URL - redirect to overview
    if (!urlState) {
      console.log("Invalid stage slug:", stageSlug);
      navigate(`/strategy/${id}`);
      return;
    }
    
    // If current strategy state exactly matches the URL state, nothing to do
    if (strategy.state === urlState) {
      console.log("URL state matches DB state:", urlState);
      return;
    }
    
    // Map the URL state to a valid database state value
    const dbState = stateToDbMap[urlState]; 
    
    // Handle state transitions based on the existing state and URL
    const handleStateTransition = async () => {
      try {
        setIsUpdating(true);
        
        // If trying to access a stage ahead of current progress, redirect to current stage
        const currentStateSlug = stateToSlug[strategy.state as StrategyState];
        
        // Skip ahead not allowed - redirect to appropriate stage
        if (!isAllowedNavigation(strategy.state as StrategyState, urlState as StrategyState)) {
          toast.error("You cannot skip ahead in the strategy workflow");
          navigate(`/strategy/${id}/${currentStateSlug}`);
          return;
        }
        
        // Update the database with the new state
        const { error } = await supabase
          .from('strategies')
          .update({ state: dbState })
          .eq('id', id);
        
        if (error) throw error;
        
        console.log(`Updated strategy state from ${strategy.state} to ${dbState}`);
        
        // Refetch the strategy data to get the updated state
        if (refetch) refetch();
        
      } catch (error: any) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to update strategy state");
      } finally {
        setIsUpdating(false);
      }
    };
    
    handleStateTransition();
    
  }, [id, stageSlug, strategy, navigate, refetch]);
  
  // Helper function to determine if a navigation is allowed
  const isAllowedNavigation = (currentState: StrategyState, targetState: StrategyState): boolean => {
    // Always allow backward navigation
    const currentIndex = Object.values(StrategyState).indexOf(currentState);
    const targetIndex = Object.values(StrategyState).indexOf(targetState);
    
    return targetIndex <= currentIndex;
  };
  
  return { isUpdating };
};

export default useStrategyStageSynchronization;
