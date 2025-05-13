
import { StrategyState } from '@/types/marketing';
import { supabase } from '@/integrations/supabase/client';
import { stateToDbMap } from '@/utils/strategyUtils';
import { toast } from 'sonner';

/**
 * Hook for handling strategy state updates
 * @param strategyId The ID of the strategy to update
 */
export const useStrategyStateUpdate = (strategyId: string) => {
  /**
   * Updates the strategy state in the database
   * @param nextState The next state to transition to
   * @returns A boolean indicating whether the update was successful
   */
  const updateStrategyState = async (nextState: StrategyState): Promise<boolean> => {
    try {
      console.log(`Updating strategy state to ${nextState}`);
      
      // Get the correct database enum value
      const dbState = stateToDbMap[nextState];
      
      if (!dbState) {
        console.error(`No valid database value found for state: ${nextState}`);
        throw new Error(`Invalid strategy state: ${nextState}`);
      }
      
      console.log(`Mapped state ${nextState} to database value: ${dbState}`);
      
      // Fix the type issue by using the exact database enum type
      // and explicitly handling the 'completed' state
      let updateData: { state: string } = {
        state: dbState
      };
      
      const { error } = await supabase
        .from('strategies')
        .update(updateData)
        .eq('id', strategyId);
    
      if (error) {
        console.error("Error updating strategy state:", error);
        console.error("Error details:", error.message, error.details, error.hint);
        toast.error(`Failed to update strategy state: ${error.message}`);
        return false;
      }
    
      console.log(`Strategy state updated successfully to ${nextState} (${dbState})`);
      return true;
    } catch (err) {
      console.error("Error in updateStrategyState:", err);
      return false;
    }
  };

  return { updateStrategyState };
};
