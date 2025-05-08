
import React from 'react';
import { StoredAIResult } from './types';
import AIGeneratorLayout from './ai-generator/AIGeneratorLayout';

interface UspCanvasAIGeneratorProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  storedAIResult?: StoredAIResult;
  onAddJobs: (jobs: any[]) => void;
  onAddPains: (pains: any[]) => void;
  onAddGains: (gains: any[]) => void;
  onResultsGenerated: (results: StoredAIResult, debugInfo?: any) => void;
}

const UspCanvasAIGenerator: React.FC<UspCanvasAIGeneratorProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  storedAIResult = { jobs: [], pains: [], gains: [] },
  onAddJobs,
  onAddPains,
  onAddGains,
  onResultsGenerated
}) => {
  return (
    <AIGeneratorLayout 
      strategyId={strategyId}
      briefingContent={briefingContent}
      personaContent={personaContent}
      storedAIResult={storedAIResult}
      onAddJobs={onAddJobs}
      onAddPains={onAddPains}
      onAddGains={onAddGains}
      onResultsGenerated={onResultsGenerated}
    />
  );
};

export default UspCanvasAIGenerator;
