
import React, { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Strategy, StrategyState } from "@/types/marketing";
import UspCanvasModule from "@/components/marketing/modules/usp-canvas";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

interface PainGainsModuleProps {
  strategy: Strategy;
  agentResults?: any[];
  briefingAgentResult?: any;
  personaAgentResult?: any;
}

const PainGainsModule: React.FC<PainGainsModuleProps> = ({
  strategy,
  agentResults = [],
  briefingAgentResult,
  personaAgentResult
}) => {
  const navigate = useNavigate();
  
  // Get the content from the briefing and persona results
  const briefingContent = briefingAgentResult?.content || '';
  const personaContent = personaAgentResult?.content || '';

  // Use the navigation hook
  const { navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId: strategy.id,
    onRefetch: () => {
      // Navigate to new URL after state change
      navigate(`/strategy/${strategy.id}`);
    }
  });

  // Handle navigation to next step (Statements module)
  const handleNavigateNext = useCallback(() => {
    if (!strategy.id) {
      toast.error("Strategy ID is missing");
      return;
    }
    
    navigateToNextStep(StrategyState.PAIN_GAINS);
  }, [navigateToNextStep, strategy.id]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <UspCanvasModule
          strategyId={strategy.id}
          briefingContent={briefingContent}
          personaContent={personaContent}
          onNavigateNext={handleNavigateNext}
          nextStageLabel="Continue to Pain & Gain Statements"
        />
      </Card>
    </div>
  );
};

export default PainGainsModule;
