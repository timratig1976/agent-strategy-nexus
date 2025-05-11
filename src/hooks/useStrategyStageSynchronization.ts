
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Strategy, StrategyState } from "@/types/marketing";
import { slugToState, stateToSlug, getStageIndex } from "@/utils/strategyUrlUtils";

interface UseStrategyStageSynchronizationProps {
  id?: string;
  stageSlug?: string;
  strategy?: Strategy | null;
  refetch: () => void;
}

export const useStrategyStageSynchronization = ({
  id,
  stageSlug,
  strategy,
  refetch
}: UseStrategyStageSynchronizationProps) => {
  const navigate = useNavigate();
  const [isSyncingState, setIsSyncingState] = useState(false);
  
  // Redirect to overview if no stage slug is provided
  useEffect(() => {
    if (id && !stageSlug) {
      navigate(`/strategy/${id}`);
    }
  }, [id, stageSlug, navigate]);

  // Sync the URL stageSlug with the database state if they don't match
  useEffect(() => {
    const syncStateWithUrl = async () => {
      if (!id || !strategy || !stageSlug || isSyncingState) return;
      
      // Get the state that corresponds to the current URL slug
      const urlState = slugToState[stageSlug];
      
      // If the URL state doesn't match the database state, update the database
      if (urlState && urlState !== strategy.state && !isSyncingState) {
        try {
          setIsSyncingState(true);
          
          // Only allow navigation to valid next steps or previous completed steps
          const urlStateIndex = getStageIndex(urlState);
          const currentStateIndex = getStageIndex(strategy.state as StrategyState);
          
          // Allow navigation to the next step or any previous step
          if (urlStateIndex === currentStateIndex + 1 || urlStateIndex <= currentStateIndex) {
            console.log(`Syncing database state to match URL: ${urlState}`);
            
            // Update the database state to match the URL
            const { error } = await supabase
              .from('strategies')
              .update({ state: urlState })
              .eq('id', id);
            
            if (error) {
              console.error('Error updating strategy state:', error);
              toast.error('Failed to update strategy state');
              // Navigate back to the current state in URL
              navigate(`/strategy/${id}/${stateToSlug[strategy.state as StrategyState]}`);
              return;
            }
            
            // Refresh the data to get the updated state
            refetch();
          } else {
            // If trying to jump ahead more than one step, redirect to the current state
            console.log("Cannot skip ahead multiple steps");
            toast.error("You need to complete previous steps first");
            navigate(`/strategy/${id}/${stateToSlug[strategy.state as StrategyState]}`);
          }
        } catch (error: any) {
          console.error('Error syncing state:', error);
          toast.error(error.message || 'Navigation failed');
        } finally {
          setIsSyncingState(false);
        }
      }
    };
    
    syncStateWithUrl();
  }, [id, stageSlug, strategy, navigate, refetch, isSyncingState]);
  
  // Redirect to the URL that matches the database state if needed
  useEffect(() => {
    if (strategy && stageSlug) {
      const currentStateSlug = stateToSlug[strategy.state as StrategyState];
      
      // If the URL doesn't match the database state and we're not already syncing
      if (currentStateSlug !== stageSlug && !isSyncingState) {
        console.log(`URL (${stageSlug}) doesn't match DB state (${currentStateSlug}), updating URL`);
        navigate(`/strategy/${id}/${currentStateSlug}`);
      }
    }
  }, [strategy, stageSlug, id, navigate, isSyncingState]);
  
  return {
    isSyncingState
  };
};

export default useStrategyStageSynchronization;
