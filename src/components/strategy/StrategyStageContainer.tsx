
import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import StrategyStageLayout from "@/components/strategy/layout/StrategyStageLayout";
import StrategyStageContent from "@/components/strategy/content/StrategyStageContent";
import useStrategyData from "@/hooks/useStrategyData";
import useStrategyStageSynchronization from "@/hooks/useStrategyStageSynchronization";

const StrategyStageContainer = () => {
  const { id, stageSlug } = useParams<{ id: string; stageSlug: string }>();
  
  // Use the custom hook to fetch all strategy data
  const { 
    strategy, 
    agentResults, 
    isLoading,
    refetch 
  } = useStrategyData({ id });
  
  // Use our custom hook for stage synchronization
  useStrategyStageSynchronization({
    id,
    stageSlug,
    strategy,
    refetch
  });
  
  // Loading states
  if (isLoading || !id || !stageSlug) {
    return <LoadingStrategy />;
  }
  
  if (!strategy) {
    return <StrategyNotFound />;
  }

  return (
    <>
      <NavBar />
      <StrategyStageLayout
        strategy={strategy}
        currentStage={stageSlug}
      >
        <StrategyStageContent
          stageSlug={stageSlug}
          strategy={strategy}
          agentResults={agentResults || []}
          id={id}
        />
      </StrategyStageLayout>
    </>
  );
};

export default StrategyStageContainer;
