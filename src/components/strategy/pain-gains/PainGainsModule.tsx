import React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Strategy, AgentResult } from "@/types/marketing";
import { useNavigate } from "react-router-dom";
import UspCanvasModule from "@/components/marketing/modules/usp-canvas/UspCanvasModule";
import { Button } from "@/components/ui/button";

interface PainGainsModuleProps {
  strategy: Strategy;
  agentResults: AgentResult[];
  briefingAgentResult: AgentResult | null;
  personaAgentResult: AgentResult | null;
}

const PainGainsModule: React.FC<PainGainsModuleProps> = ({
  strategy,
  agentResults,
  briefingAgentResult,
  personaAgentResult
}) => {
  const navigate = useNavigate();

  // Handler for going back to persona development
  const handleGoToPreviousStep = async () => {
    try {
      console.log("Going back to persona development for strategy:", strategy.id);
      
      // Update the strategy state back to persona
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'persona' })
        .eq('id', strategy.id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to go back to persona stage");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Returned to Persona Development stage");
      
      // Then navigate back to the strategy details page with updated state
      navigate(`/strategy-details/${strategy.id}`);
    } catch (err) {
      console.error("Failed to go back to persona development:", err);
      toast.error("Failed to navigate back to persona development");
    }
  };
  
  // Handler for going to the next step (funnel)
  const handleGoToNextStep = async () => {
    try {
      console.log("Going to funnel step for strategy:", strategy.id);
      
      // Update the strategy state to funnel
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'funnel' })
        .eq('id', strategy.id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to move to Funnel step");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Moving to Funnel Strategy step");
      
      // Navigate to the strategy details page with updated state
      navigate(`/strategy-details/${strategy.id}`);
    } catch (err) {
      console.error("Failed to move to next step:", err);
      toast.error("Failed to move to Funnel step");
    }
  };
  
  // Check if we have the needed persona data
  if (!personaAgentResult) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-lg font-medium text-yellow-800">Missing Persona Data</h3>
        <p className="text-yellow-700">
          Please complete the Persona Development stage before proceeding to USP Canvas.
        </p>
        <Button 
          onClick={handleGoToPreviousStep}
          className="mt-4 bg-yellow-600 text-white hover:bg-yellow-700"
        >
          Go to Persona Development
        </Button>
      </div>
    );
  }

  return (
    <UspCanvasModule
      strategyId={strategy.id}
      briefingContent={briefingAgentResult?.content || ""}
      personaContent={personaAgentResult?.content || ""}
      onNavigateBack={handleGoToPreviousStep}
      onNavigateNext={handleGoToNextStep}
    />
  );
};

export default PainGainsModule;
