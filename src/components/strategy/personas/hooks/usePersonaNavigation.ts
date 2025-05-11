
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StrategyState } from "@/types/marketing";
import { stateToSlug } from "@/utils/strategyUrlUtils";

export const usePersonaNavigation = (strategyId: string) => {
  const navigate = useNavigate();
  
  // Handler for going back to the briefing step
  const handleGoToPreviousStep = async () => {
    try {
      console.log("Going back to briefing step for strategy:", strategyId);
      
      // Use the URL-based navigation
      const briefingSlug = stateToSlug[StrategyState.BRIEFING];
      navigate(`/strategy/${strategyId}/${briefingSlug}`);
      
      toast.success("Navigating to Briefing stage");
    } catch (err) {
      console.error("Failed to go back to briefing:", err);
      toast.error("Failed to go back to briefing stage");
    }
  };

  // Handler for going to the next step (pain_gains)
  const handleGoToNextStep = async () => {
    try {
      console.log("Going to pain_gains step for strategy:", strategyId);
      
      // Use the URL-based navigation
      const painGainsSlug = stateToSlug[StrategyState.PAIN_GAINS];
      navigate(`/strategy/${strategyId}/${painGainsSlug}`);
      
      toast.success("Moving to USP Canvas step");
    } catch (err) {
      console.error("Failed to move to next step:", err);
      toast.error("Failed to move to USP Canvas step");
    }
  };
  
  return {
    handleGoToPreviousStep,
    handleGoToNextStep
  };
};
