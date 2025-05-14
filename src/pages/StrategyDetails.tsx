
import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";

// Import refactored components
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import StrategyBriefing from "@/components/strategy/briefing";
import { PersonaDevelopment } from "@/components/strategy/personas";
import PainGainsModule from "@/components/strategy/pain-gains";
import StatementsModule from "@/components/strategy/statements";
import ChannelStrategyModule from "@/components/strategy/channel-strategy";
import FunnelStrategyModule from "@/components/strategy/funnel";
import RoasCalculatorModule from "@/components/strategy/roas-calculator";
import { AdCampaignModule } from "@/components/strategy/ads";

// Import custom hooks and utilities
import useStrategyData from "@/hooks/useStrategyData";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";
import { StrategyState } from "@/types/marketing";

const StrategyDetails = () => {
  // Extract the id parameter from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Redirect to dashboard if no ID is provided
  useEffect(() => {
    if (!id) {
      toast.error("Strategy ID is missing");
      navigate('/dashboard');
      return;
    }
  }, [id, navigate, searchParams]);
  
  // Use the custom hook to fetch all strategy data
  const { 
    strategy, 
    agentResults, 
    isLoading,
    refetch 
  } = useStrategyData({ id });

  // Use the custom navigation hook
  const { 
    navigateToPreviousStep
  } = useStrategyNavigation({
    strategyId: id,
    onRefetch: refetch
  });
  
  // Refresh the data when the component mounts or when the URL changes
  useEffect(() => {
    if (id) {
      console.log("Refreshing strategy data for ID:", id);
      refetch();
    }
  }, [id, refetch]);
  
  // If there's no ID, show a loading state until the redirect happens
  if (!id) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </>
    );
  }
  
  if (isLoading) {
    return <LoadingStrategy />;
  }
  
  if (!strategy) {
    return <StrategyNotFound />;
  }

  // Determine the final briefing result to pass to other pages
  const finalBriefing = agentResults?.find(result => 
    result.metadata?.is_final === true && (!result.metadata?.type || result.metadata?.type === 'briefing')
  ) || null;
  
  // Determine the final persona result to pass to pain_gains page
  const finalPersona = agentResults?.find(result =>
    result.metadata?.is_final === true && result.metadata?.type === 'persona'
  ) || null;

  console.log("Current strategy state:", strategy.state);
  console.log("Final briefing found:", !!finalBriefing);
  console.log("Final persona found:", !!finalPersona);

  // Determine which component to render based on the strategy state
  let contentComponent;
  if (strategy.state === 'briefing') {
    contentComponent = (
      <StrategyBriefing 
        strategy={strategy} 
        agentResults={agentResults || []} 
      />
    );
  } else if (strategy.state === 'persona') {
    contentComponent = (
      <PersonaDevelopment 
        strategy={strategy}
        agentResults={agentResults || []}
        briefingAgentResult={finalBriefing}
      />
    );
  } else if (strategy.state === 'pain_gains') {
    contentComponent = (
      <PainGainsModule 
        strategy={strategy}
        agentResults={agentResults || []}
        briefingAgentResult={finalBriefing}
        personaAgentResult={finalPersona}
      />
    );
  } else if (strategy.state === 'statements') {
    contentComponent = (
      <StatementsModule 
        strategy={strategy}
      />
    );
  } else if (strategy.state === 'channel_strategy') {
    contentComponent = (
      <ChannelStrategyModule 
        strategy={strategy}
        briefingAgentResult={finalBriefing}
        personaAgentResult={finalPersona}
      />
    );
  } else if (strategy.state === 'funnel') {
    contentComponent = (
      <FunnelStrategyModule 
        strategy={strategy}
      />
    );
  } else if (strategy.state === 'roas_calculator') {
    contentComponent = (
      <RoasCalculatorModule
        strategy={strategy}
      />
    );
  } else if (strategy.state === 'ads') {
    contentComponent = (
      <AdCampaignModule
        strategy={strategy}
        onNavigateBack={() => navigateToPreviousStep(StrategyState.ADS)}
      />
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <StrategyBackButton />
          
          <StrategyHeader 
            strategy={strategy}
            getStateLabel={getStateLabel}
            getStateColor={getStateColor}
          />
        </div>
        
        {contentComponent}
      </div>
    </>
  );
};

export default StrategyDetails;
