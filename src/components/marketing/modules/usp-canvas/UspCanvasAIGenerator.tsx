
import React, { useState } from 'react';
import { StoredAIResult } from './types';
import GeneratorForm from './ai-generator/GeneratorForm';
import ResultTabs from './ai-generator/ResultTabs';
import ResultDisplay from './ai-generator/ResultDisplay';
import { useAIGenerator } from './ai-generator/useAIGenerator';

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
  const { 
    isGenerating, 
    error, 
    activeTab, 
    setActiveTab, 
    generateResult 
  } = useAIGenerator(strategyId, briefingContent, personaContent, onResultsGenerated);
  
  // Format content for display
  const formatContent = (items: any[] | undefined) => {
    return <ResultDisplay items={items} />;
  };
  
  const hasResults = storedAIResult && (
    (storedAIResult.jobs && storedAIResult.jobs.length > 0) ||
    (storedAIResult.pains && storedAIResult.pains.length > 0) ||
    (storedAIResult.gains && storedAIResult.gains.length > 0)
  );

  return (
    <div className="space-y-8">
      <GeneratorForm 
        isGenerating={isGenerating}
        error={error}
        generateResult={generateResult}
        hasResults={!!hasResults}
      />
      
      {!isGenerating && hasResults && (
        <div className="mt-8">
          <ResultTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            storedAIResult={storedAIResult}
            handleAddJobs={onAddJobs}
            handleAddPains={onAddPains}
            handleAddGains={onAddGains}
            formatContent={formatContent}
          />
        </div>
      )}
    </div>
  );
};

export default UspCanvasAIGenerator;
