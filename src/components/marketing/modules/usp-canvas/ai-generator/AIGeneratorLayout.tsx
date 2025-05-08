
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { StoredAIResult } from "../types";
import { toast } from 'sonner';
import GeneratorForm from './GeneratorForm';
import ResultsSection from './ResultsSection';
import DebugSection from './DebugSection';
import AIResponseValidator from '@/components/shared/AIResponseValidator';
import { useAIGenerator } from './useAIGenerator';
import ResultDisplay from './ResultDisplay';

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
  // Use the useAIGenerator hook
  const { 
    isGenerating, 
    error, 
    debugInfo,
    activeTab, 
    setActiveTab, 
    generateResult,
    generationHistory,
    rawResponse,
    parseResults,
    showDebug, 
    setShowDebug
  } = useAIGenerator(strategyId, briefingContent, personaContent, onResultsGenerated);

  // Format content for display
  const formatContent = (items: any[] | undefined, onAddSingleItem?: (item: any) => void) => {
    if (!items || items.length === 0) {
      return (
        <div className="p-3 text-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground text-sm">No items generated yet</p>
        </div>
      );
    }
    return <ResultDisplay items={items} onAddSingleItem={onAddSingleItem} />;
  };

  // Check if we have any results
  const hasResults = storedAIResult && (
    (storedAIResult.jobs && storedAIResult.jobs.length > 0) ||
    (storedAIResult.pains && storedAIResult.pains.length > 0) ||
    (storedAIResult.gains && storedAIResult.gains.length > 0)
  );

  // Create wrapper functions to handle passing the stored results to the handlers
  const handleAddJobs = () => {
    if (storedAIResult?.jobs && storedAIResult.jobs.length > 0) {
      console.log('Adding jobs to canvas:', storedAIResult.jobs);
      onAddJobs(storedAIResult.jobs);
      toast.success(`Added ${storedAIResult.jobs.length} jobs to canvas`);
    }
  };

  const handleAddPains = () => {
    if (storedAIResult?.pains && storedAIResult.pains.length > 0) {
      console.log('Adding pains to canvas:', storedAIResult.pains);
      onAddPains(storedAIResult.pains);
      toast.success(`Added ${storedAIResult.pains.length} pains to canvas`);
    }
  };

  const handleAddGains = () => {
    if (storedAIResult?.gains && storedAIResult.gains.length > 0) {
      console.log('Adding gains to canvas:', storedAIResult.gains);
      onAddGains(storedAIResult.gains);
      toast.success(`Added ${storedAIResult.gains.length} gains to canvas`);
    }
  };

  // Single item handlers
  const handleAddSingleJob = (job: any) => {
    console.log('Adding single job to canvas:', job);
    onAddJobs([job]);
    toast.success(`Added "${job.content.substring(0, 30)}..." to jobs`);
  };

  const handleAddSinglePain = (pain: any) => {
    console.log('Adding single pain to canvas:', pain);
    onAddPains([pain]);
    toast.success(`Added "${pain.content.substring(0, 30)}..." to pains`);
  };

  const handleAddSingleGain = (gain: any) => {
    console.log('Adding single gain to canvas:', gain);
    onAddGains([gain]);
    toast.success(`Added "${gain.content.substring(0, 30)}..." to gains`);
  };

  // Toggle debug panel
  const toggleDebugPanel = () => {
    setShowDebug(prev => !prev);
  };

  // Check if we have briefing content
  if (!briefingContent) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Information</AlertTitle>
        <AlertDescription>
          A marketing briefing is required to generate USP Canvas elements. 
          Please complete the briefing stage first.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare validation results for the validator component
  const validationResults = debugInfo?.validationResults ? {
    jobsComplete: debugInfo.validationResults.jobsComplete,
    painsComplete: debugInfo.validationResults.painsComplete,
    gainsComplete: debugInfo.validationResults.gainsComplete,
    isComplete: debugInfo.validationResults.isComplete
  } : undefined;

  return (
    <div className="space-y-4">
      <GeneratorForm 
        isGenerating={isGenerating}
        error={error}
        generateResult={generateResult}
        hasResults={!!hasResults}
        onToggleDebug={toggleDebugPanel}
        showDebug={showDebug}
      />
      
      {!isGenerating && parseResults && (
        <AIResponseValidator 
          validationResults={validationResults}
          parsingResults={{
            jobsFound: parseResults.jobsFound,
            painsFound: parseResults.painsFound, 
            gainsFound: parseResults.gainsFound,
            rawText: parseResults.rawText,
            extractedItems: parseResults.extractedItems
          }}
        />
      )}
      
      <ResultsSection 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storedAIResult={storedAIResult}
        handleAddJobs={handleAddJobs}
        handleAddPains={handleAddPains}
        handleAddGains={handleAddGains}
        handleAddSingleJob={handleAddSingleJob}
        handleAddSinglePain={handleAddSinglePain}
        handleAddSingleGain={handleAddSingleGain}
        formatContent={formatContent}
        isGenerating={isGenerating}
      />

      {showDebug && debugInfo && (
        <DebugSection 
          debugInfo={debugInfo}
          parseResults={parseResults}
          validationResults={validationResults}
          rawResponse={rawResponse}
          generationHistory={generationHistory}
          showDebug={showDebug}
        />
      )}
    </div>
  );
};

export default AIGeneratorLayout;
