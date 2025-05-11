
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Strategy, StrategyState } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugToState, stateToSlug } from "@/utils/strategyUrlUtils";
import { stateToDbMap } from "@/utils/strategyUtils";
import { isValidStrategyState } from "@/utils/typeUtils";

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
    // We need to ensure urlState is a valid StrategyState before using it as a key in stateToDbMap
    if (!isValidStrategyState(urlState)) {
      console.error("URL state is not a valid StrategyState:", urlState);
      navigate(`/strategy/${id}`);
      return;
    }
    
    const dbState = stateToDbMap[urlState]; 
    
    // Handle state transitions based on the existing state and URL
    const handleStateTransition = async () => {
      try {
        setIsUpdating(true);
        
        console.log(`Handling transition from ${strategy.state} to ${urlState}`);
        // Instead of restricting forward navigation, we'll allow all stage navigation 
        // from the dropdown menu but sync the database accordingly
        
        // Update the database with the new state
        // Fix for TypeScript error: Type assertion to make TypeScript understand
        // that dbState is a valid value for the database enum
        const { error } = await supabase
          .from('strategies')
          .update({ state: dbState as string })
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
  
  return { isUpdating };
};

export default useStrategyStageSynchronization;
