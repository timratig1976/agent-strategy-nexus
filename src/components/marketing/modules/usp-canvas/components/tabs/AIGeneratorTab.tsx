
import React from "react";
import UspCanvasAIGenerator from "../../UspCanvasAIGenerator";
import { StoredAIResult } from "../../types";

interface AIGeneratorTabProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  handleAddAIJobs: (jobs: any[]) => void;
  handleAddAIPains: (pains: any[]) => void;
  handleAddAIGains: (gains: any[]) => void;
  storedAIResult: StoredAIResult;
  handleAIResultsGenerated: (result: any, debugInfo?: any) => void;
}

const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  handleAddAIJobs,
  handleAddAIPains,
  handleAddAIGains,
  storedAIResult,
  handleAIResultsGenerated
}) => {
  return (
    <UspCanvasAIGenerator
      strategyId={strategyId}
      briefingContent={briefingContent}
      personaContent={personaContent}
      onAddJobs={handleAddAIJobs}
      onAddPains={handleAddAIPains}
      onAddGains={handleAddAIGains}
      storedAIResult={storedAIResult}
      onResultsGenerated={handleAIResultsGenerated}
    />
  );
};

export default AIGeneratorTab;
