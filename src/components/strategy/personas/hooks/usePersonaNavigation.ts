
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePersonaNavigation = (strategyId: string) => {
  const navigate = useNavigate();
  
  // Handler for going back to the briefing step
  const handleGoToPreviousStep = async () => {
    try {
      console.log("Going back to briefing step for strategy:", strategyId);
      
      // First update the strategy state back to briefing
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'briefing' })
        .eq('id', strategyId)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to go back to briefing stage");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Returned to Briefing stage");
      
      // Then navigate back to the strategy details page
      navigate(`/strategy-details/${strategyId}`);
    } catch (err) {
      console.error("Failed to go back to briefing:", err);
      toast.error("Failed to go back to briefing stage");
    }
  };

  // Handler for going to the next step (pain_gains)
  const handleGoToNextStep = async () => {
    try {
      console.log("Going to pain_gains step for strategy:", strategyId);
      
      // Update the strategy state to pain_gains
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'pain_gains' })
        .eq('id', strategyId)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to move to USP Canvas step");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Moving to USP Canvas step");
      
      // Navigate to the strategy details page
      navigate(`/strategy-details/${strategyId}`);
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
