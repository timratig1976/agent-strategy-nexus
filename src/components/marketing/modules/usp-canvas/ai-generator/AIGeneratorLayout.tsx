
import React from 'react';
import GeneratorForm from './GeneratorForm';
import ResultsSection from './ResultsSection';
import DebugSection from './DebugSection';
import { StoredAIResult } from '../types';
import { useAIGenerator } from './useAIGenerator';

interface AIGeneratorLayoutProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  storedAIResult: StoredAIResult;
  onAddJobs: (jobs: any[]) => void;
  onAddPains: (pains: any[]) => void;
  onAddGains: (gains: any[]) => void;
  onResultsGenerated: (results: StoredAIResult, debugInfo?: any) => void;
}

const AIGeneratorLayout: React.FC<AIGeneratorLayoutProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  storedAIResult,
  onAddJobs,
  onAddPains,
  onAddGains,
  onResultsGenerated
}) => {
  // Use AI generator hook
  const {
    isGenerating,
    error,
    debugInfo,
    activeTab,
    // No longer use setActiveTab since we show all tabs at once
    generateResult,
    generationHistory,
    rawResponse,
    parseResults,
    showDebug,
    setShowDebug,
    progress
  } = useAIGenerator(
    strategyId,
    briefingContent,
    personaContent,
    onResultsGenerated
  );

  // Toggle debug visibility
  const handleToggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const hasResults = 
    (storedAIResult.jobs && storedAIResult.jobs.length > 0) ||
    (storedAIResult.pains && storedAIResult.pains.length > 0) ||
    (storedAIResult.gains && storedAIResult.gains.length > 0);

  return (
    <div className="space-y-6">
      <GeneratorForm 
        isGenerating={isGenerating} 
        error={error} 
        generateResult={generateResult}
        hasResults={hasResults}
        onToggleDebug={handleToggleDebug}
        showDebug={showDebug}
        progress={progress}
      />
      
      {hasResults && (
        <ResultsSection 
          storedAIResult={storedAIResult}
          onAddJobs={onAddJobs}
          onAddPains={onAddPains}
          onAddGains={onAddGains}
          activeTab={activeTab}
          setActiveTab={() => {}} // Pass empty function since we don't need tab switching
        />
      )}
      
      {showDebug && debugInfo && (
        <DebugSection 
          debugInfo={debugInfo}
          parseResults={parseResults}
          rawResponse={rawResponse}
          showDebug={showDebug}
          generationHistory={generationHistory}
        />
      )}
    </div>
  );
};

export default AIGeneratorLayout;
