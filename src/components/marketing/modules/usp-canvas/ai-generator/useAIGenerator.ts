import { useState, useCallback, useEffect } from 'react';
import { UspCanvasService } from '@/services/ai/uspCanvasService';
import { StoredAIResult } from '../types';
import { toast } from 'sonner';

interface ParseResults {
  jobsFound: number;
  painsFound: number;
  gainsFound: number;
  rawText: string;
  extractedItems: any;
}

export const useAIGenerator = (
  strategyId: string,
  briefingContent: string,
  personaContent: string | undefined,
  onResultsGenerated: (results: StoredAIResult, debugInfo?: any) => void
) => {
  // Add state for showing debug panel
  const [showDebug, setShowDebug] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [parseResults, setParseResults] = useState<ParseResults | null>(null);

  const generateResult = useCallback(
    async (enhancementText?: string, formatOptions?: any) => {
      setIsGenerating(true);
      setError(null);
      setDebugInfo(null);
      setRawResponse(null);
      setParseResults(null);

      try {
        const result = await UspCanvasService.generateUspCanvasProfile(
          strategyId,
          briefingContent,
          'all',
          enhancementText,
          personaContent,
          formatOptions
        );

        setRawResponse(result);

        if (result.error) {
          setError(result.error);
          setDebugInfo(result.debugInfo);
          toast.error(`AI Generation Failed: ${result.error}`);
          return;
        }

        if (result.data) {
          // Parse results and set state
          const { jobs, pains, gains, rawOutput } = result.data;
          const jobsFound = jobs?.length || 0;
          const painsFound = pains?.length || 0;
          const gainsFound = gains?.length || 0;

          // Extract items for validation
          const extractedItems = {
            jobs: jobs || [],
            pains: pains || [],
            gains: gains || []
          };

          setParseResults({
            jobsFound,
            painsFound,
            gainsFound,
            rawText: rawOutput || '',
            extractedItems
          });

          // Validate results
          const jobsComplete = jobsFound > 0;
          const painsComplete = painsFound > 0;
          const gainsComplete = gainsFound > 0;
          const isComplete = jobsComplete && painsComplete && gainsComplete;

          // Set debug info
          setDebugInfo({
            ...result.debugInfo,
            validationResults: {
              jobsComplete,
              painsComplete,
              gainsComplete,
              isComplete
            }
          });

          // Store AI result
          const storedAIResult: StoredAIResult = {
            jobs: jobs || [],
            pains: pains || [],
            gains: gains || [],
          };
          onResultsGenerated(storedAIResult, result.debugInfo);
          
          // Add to generation history
          setGenerationHistory(prevHistory => [
            ...prevHistory,
            {
              timestamp: Date.now(),
              result: storedAIResult,
              debugInfo: result.debugInfo
            }
          ]);
          
          // Show success toast
          toast.success('AI Generation Complete!');
        } else {
          setError('No data received from AI service.');
          toast.error('AI Generation Failed: No data received.');
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
        toast.error(`AI Generation Failed: ${e.message}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [strategyId, briefingContent, personaContent, onResultsGenerated]
  );

  // Return the additional state variables
  return {
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
  };
};
