
import React from "react";
import { StoredAIResult } from "../../types";
import UspCanvasAIGenerator from "../../UspCanvasAIGenerator";

interface AIGenTabProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  handleAddAIJobs: (jobs: any[]) => void;
  handleAddAIPains: (pains: any[]) => void;
  handleAddAIGains: (gains: any[]) => void;
  storedAIResult: StoredAIResult | null;
  onAIResultsGenerated: (result: any) => void;
}

const AIGenTab: React.FC<AIGenTabProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  handleAddAIJobs,
  handleAddAIPains,
  handleAddAIGains,
  storedAIResult,
  onAIResultsGenerated
}) => {
  return (
    <UspCanvasAIGenerator 
      strategyId={strategyId}
      briefingContent={briefingContent}
      personaContent={personaContent}
      onAddJobs={handleAddAIJobs}
      onAddPains={handleAddAIPains}
      onAddGains={handleAddAIGains}
      storedAIResult={storedAIResult || { jobs: [], pains: [], gains: [] }}
      onResultsGenerated={onAIResultsGenerated}
    />
  );
};

export default AIGenTab;
