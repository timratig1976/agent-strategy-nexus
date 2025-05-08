
import React from "react";
import UspCanvasAIGenerator from "../../UspCanvasAIGenerator";
import { StoredAIResult } from "../../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  if (!strategyId || strategyId === 'standalone-module') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Strategy ID Required</AlertTitle>
        <AlertDescription>
          AI generation is only available for USP Canvas modules within a strategy.
          Please create or open a strategy to use this feature.
        </AlertDescription>
      </Alert>
    );
  }

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
