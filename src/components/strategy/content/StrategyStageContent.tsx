
import React from "react";
import { useNavigate } from "react-router-dom";
import { Strategy, StrategyState } from "@/types/marketing";
import { AgentResult } from "@/types/marketing";

// Import strategy stage components
import StrategyBriefing from "@/components/strategy/briefing";
import { PersonaDevelopment } from "@/components/strategy/personas";
import PainGainsModule from "@/components/strategy/pain-gains";
import StatementsModule from "@/components/strategy/statements";
import ChannelStrategyModule from "@/components/strategy/channel-strategy";
import FunnelStrategyModule from "@/components/strategy/funnel";
import RoasCalculatorModule from "@/components/strategy/roas-calculator";
import { AdCampaignModule } from "@/components/strategy/ads";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

interface StrategyStageContentProps {
  stageSlug: string;
  strategy: Strategy;
  agentResults: AgentResult[];
  id?: string;
  onNavigateBack?: () => void;
}

const StrategyStageContent: React.FC<StrategyStageContentProps> = ({
  stageSlug,
  strategy,
  agentResults,
  id,
}) => {
  const navigate = useNavigate();
  
  // Use the navigation hook to get navigation functions
  const { navigateToPreviousStep } = useStrategyNavigation({ 
    strategyId: id, 
  });

  // Determine the final briefing result to pass to other pages
  const finalBriefing = agentResults?.find(result => 
    result.metadata?.is_final === true && (!result.metadata?.type || result.metadata?.type === 'briefing')
  ) || null;
  
  // Determine the final persona result to pass to pain_gains page
  const finalPersona = agentResults?.find(result =>
    result.metadata?.is_final === true && result.metadata?.type === 'persona'
  ) || null;

  // Handle back navigation for ad campaign module
  const handleAdCampaignBack = () => {
    if (id) {
      navigateToPreviousStep(StrategyState.ADS);
    }
  };

  // Determine which component to render based on the URL stage
  switch (stageSlug) {
    case "briefing":
      return (
        <StrategyBriefing 
          strategy={strategy} 
          agentResults={agentResults || []} 
        />
      );
    case "persona":
      return (
        <PersonaDevelopment 
          strategy={strategy}
          agentResults={agentResults || []}
          briefingAgentResult={finalBriefing}
        />
      );
    case "usp-canvas":
      return (
        <PainGainsModule 
          strategy={strategy}
          agentResults={agentResults || []}
          briefingAgentResult={finalBriefing}
          personaAgentResult={finalPersona}
        />
      );
    case "statements":
      return (
        <StatementsModule 
          strategy={strategy}
        />
      );
    case "channel-strategy":
      return (
        <ChannelStrategyModule 
          strategy={strategy}
          briefingAgentResult={finalBriefing}
          personaAgentResult={finalPersona}
        />
      );
    case "funnel":
      return (
        <FunnelStrategyModule 
          strategy={strategy}
        />
      );
    case "roas-calculator":
      return (
        <RoasCalculatorModule
          strategy={strategy}
        />
      );
    case "ad-campaign":
      return (
        <AdCampaignModule
          strategy={strategy}
          onNavigateBack={handleAdCampaignBack}
        />
      );
    default:
      // If the stage doesn't exist, redirect to overview
      navigate(`/strategy/${id}`);
      return null;
  }
};

export default StrategyStageContent;
