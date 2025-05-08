
import React, { useState } from 'react';
import { toast } from 'sonner';
import { StoredAIResult } from './types';
import GeneratorForm from './ai-generator/GeneratorForm';
import ResultTabs from './ai-generator/ResultTabs';
import ResultDisplay from './ai-generator/ResultDisplay';
import { useAIGenerator } from './ai-generator/useAIGenerator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AIDebugPanel from '@/components/shared/AIDebugPanel';
import AIResponseValidator from '@/components/shared/AIResponseValidator';

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
  const [showDebug, setShowDebug] = useState(false);
  const { 
    isGenerating, 
    error, 
    debugInfo,
    activeTab, 
    setActiveTab, 
    generateResult,
    generationHistory,
    rawResponse,
    parseResults
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
    }
  };

  const handleAddPains = () => {
    if (storedAIResult?.pains && storedAIResult.pains.length > 0) {
      console.log('Adding pains to canvas:', storedAIResult.pains);
      onAddPains(storedAIResult.pains);
    }
  };

  const handleAddGains = () => {
    if (storedAIResult?.gains && storedAIResult.gains.length > 0) {
      console.log('Adding gains to canvas:', storedAIResult.gains);
      onAddGains(storedAIResult.gains);
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
      
      {!isGenerating && hasResults && (
        <div>
          <ResultTabs 
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
          />
        </div>
      )}

      {showDebug && debugInfo && (
        <>
          <AIDebugPanel 
            debugInfo={debugInfo} 
            title="USP Canvas AI Generator Debug Information"
          />
          
          {parseResults && !validationResults && (
            <div className="bg-muted/20 p-4 rounded-lg border mt-4">
              <h3 className="font-medium mb-2">Data Extraction Results</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Jobs found:</span>
                    <span className={parseResults.jobsFound > 0 ? "text-green-600" : "text-red-600"}>
                      {parseResults.jobsFound}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Pains found:</span>
                    <span className={parseResults.painsFound > 0 ? "text-green-600" : "text-red-600"}>
                      {parseResults.painsFound}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Gains found:</span>
                    <span className={parseResults.gainsFound > 0 ? "text-green-600" : "text-red-600"}>
                      {parseResults.gainsFound}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {rawResponse && (
            <div className="bg-muted/20 p-4 rounded-lg border mt-4">
              <h3 className="font-medium mb-2">Raw AI Response</h3>
              <div className="bg-gray-900 text-gray-200 p-3 rounded overflow-auto max-h-64 text-xs">
                <pre>{JSON.stringify(rawResponse.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
      
      {generationHistory && generationHistory.length > 0 && showDebug && (
        <AIDebugPanel 
          debugInfo={generationHistory} 
          title="Generation History"
        />
      )}
    </div>
  );
};

export default UspCanvasAIGenerator;
