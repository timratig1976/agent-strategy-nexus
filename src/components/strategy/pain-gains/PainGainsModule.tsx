
import React from "react";
import UspCanvasModule from "@/components/marketing/modules/usp-canvas";
import { Strategy, AgentResult } from "@/types/marketing";

interface PainGainsModuleProps {
  strategy: Strategy;
  agentResults: AgentResult[];
  briefingAgentResult: AgentResult | null;
}

const PainGainsModule: React.FC<PainGainsModuleProps> = ({ 
  strategy, 
  agentResults,
  briefingAgentResult 
}) => {
  // Extract briefing content to pass to the USP Canvas
  const briefingContent = briefingAgentResult?.content || "";
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Pain Points & Gains Analysis</h2>
      <p className="text-muted-foreground">
        Identify your customer pain points and desired gains to create a compelling unique selling proposition.
      </p>
      
      <div className="mt-8">
        <UspCanvasModule 
          strategyId={strategy.id}
          briefingContent={briefingContent}
        />
      </div>
    </div>
  );
};

export default PainGainsModule;
