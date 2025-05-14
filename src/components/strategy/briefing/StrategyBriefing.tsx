
import React from "react";
import { StrategyBriefingProps } from "./types";
import BriefingContainer from "./containers/BriefingContainer";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
  return (
    <BriefingContainer 
      strategy={strategy}
      agentResults={agentResults}
    />
  );
};

export default StrategyBriefing;
