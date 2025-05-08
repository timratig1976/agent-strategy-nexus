
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
    generationHistory
  } = useAIGenerator(strategyId, briefingContent, personaContent, onResultsGenerated);
  
  // Format content for display
  const formatContent = (items: any[] | undefined, onAddSingleItem?: (item: any) => void) => {
    if (!items || items.length === 0) {
      return (
        <div className="p-4 text-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground">No items generated yet</p>
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

  return (
    <div className="space-y-8">
      <GeneratorForm 
        isGenerating={isGenerating}
        error={error}
        generateResult={generateResult}
        hasResults={!!hasResults}
        onToggleDebug={toggleDebugPanel}
        showDebug={showDebug}
      />
      
      {!isGenerating && hasResults && (
        <div className="mt-8">
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
        <AIDebugPanel 
          debugInfo={debugInfo} 
          title="USP Canvas AI Generator Debug Information"
        />
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
