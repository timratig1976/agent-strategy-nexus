
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Import strategy stage components
import StrategyBriefing from "@/components/strategy/briefing";
import { PersonaDevelopment } from "@/components/strategy/personas";
import PainGainsModule from "@/components/strategy/pain-gains";
import StatementsModule from "@/components/strategy/statements";
import ChannelStrategyModule from "@/components/strategy/channel-strategy";
import FunnelStrategyModule from "@/components/strategy/funnel";
import RoasCalculatorModule from "@/components/strategy/roas-calculator";
import AdCampaignModule from "@/components/strategy/ads";

// Import utilities and hooks
import useStrategyData from "@/hooks/useStrategyData";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import NavBar from "@/components/NavBar";
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import StrategyProgress from "@/components/strategy/StrategyProgress";
import { slugToState, stateToSlug, getStageIndex, getStageLabel } from "@/utils/strategyUrlUtils";
import { getStateColor } from "@/utils/strategyUtils";
import { StrategyState } from "@/types/marketing";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

const StrategyStageContainer = () => {
  const { id, stageSlug } = useParams<{ id: string; stageSlug: string }>();
  const navigate = useNavigate();
  const [isSyncingState, setIsSyncingState] = useState(false);
  
  // Use the custom hook to fetch all strategy data
  const { 
    strategy, 
    agentResults, 
    isLoading,
    refetch 
  } = useStrategyData({ id });
  
  // Use the navigation hook to get navigation functions
  const { navigateToPreviousStep } = useStrategyNavigation({ 
    strategyId: id, 
    onRefetch: refetch 
  });

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
          const currentStateIndex = getStageIndex(strategy.state);
          
          // Allow navigation to the next step or any previous step
          if (urlStateIndex === currentStateIndex + 1 || urlStateIndex <= currentStateIndex) {
            console.log(`Syncing database state to match URL: ${urlState}`);
            
            // Use the mapping function to convert enum to valid database string
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
  
  // Loading states
  if (isLoading || !id || !stageSlug) {
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

  // Handle back navigation for ad campaign module
  const handleAdCampaignBack = () => {
    if (id) {
      navigateToPreviousStep(StrategyState.ADS);
    }
  };

  // Determine which component to render based on the URL stage
  let stageComponent;
  switch (stageSlug) {
    case "briefing":
      stageComponent = (
        <StrategyBriefing 
          strategy={strategy} 
          agentResults={agentResults || []} 
        />
      );
      break;
    case "persona":
      stageComponent = (
        <PersonaDevelopment 
          strategy={strategy}
          agentResults={agentResults || []}
          briefingAgentResult={finalBriefing}
        />
      );
      break;
    case "usp-canvas":
      stageComponent = (
        <PainGainsModule 
          strategy={strategy}
          agentResults={agentResults || []}
          briefingAgentResult={finalBriefing}
          personaAgentResult={finalPersona}
        />
      );
      break;
    case "statements":
      stageComponent = (
        <StatementsModule 
          strategy={strategy}
        />
      );
      break;
    case "channel-strategy":
      stageComponent = (
        <ChannelStrategyModule 
          strategy={strategy}
          briefingAgentResult={finalBriefing}
          personaAgentResult={finalPersona}
        />
      );
      break;
    case "funnel":
      stageComponent = (
        <FunnelStrategyModule 
          strategy={strategy}
        />
      );
      break;
    case "roas-calculator":
      stageComponent = (
        <RoasCalculatorModule
          strategy={strategy}
        />
      );
      break;
    case "ad-campaign":
      stageComponent = (
        <AdCampaignModule
          strategy={strategy}
          onNavigateBack={handleAdCampaignBack}
        />
      );
      break;
    default:
      // If the stage doesn't exist, redirect to overview
      navigate(`/strategy/${id}`);
      return <LoadingStrategy />;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <StrategyBackButton />
          
          <StrategyHeader 
            strategy={strategy}
            getStateLabel={getStageLabel}
            getStateColor={getStateColor}
          />
          
          <StrategyProgress 
            currentStage={stageSlug}
            strategy={strategy}
          />
        </div>
        
        {stageComponent}
      </div>
    </>
  );
};

export default StrategyStageContainer;
