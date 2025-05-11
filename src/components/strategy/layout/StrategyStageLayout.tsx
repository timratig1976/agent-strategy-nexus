
import React, { ReactNode } from "react";
import { Strategy } from "@/types/marketing";
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import StrategyProgress from "@/components/strategy/StrategyProgress";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";

interface StrategyStageLayoutProps {
  strategy: Strategy;
  currentStage: string;
  children: ReactNode;
}

/**
 * Layout component for strategy stage pages
 * 
 * Provides consistent layout with back button, strategy header and progress bar
 */
const StrategyStageLayout: React.FC<StrategyStageLayoutProps> = ({
  strategy,
  currentStage,
  children
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <StrategyBackButton />
        
        <StrategyHeader 
          strategy={strategy}
          getStateLabel={getStateLabel}
          getStateColor={getStateColor}
        />
        
        <StrategyProgress 
          currentStage={currentStage}
          strategy={strategy}
        />
      </div>
      
      {children}
    </div>
  );
};

export default StrategyStageLayout;
