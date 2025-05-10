
import { useState, useCallback } from 'react';
import { generateUspCanvasProfile } from '@/services/ai/uspCanvasService';
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
  // Add progress state
  const [progress, setProgress] = useState<number>(0);

  const generateResult = useCallback(
    async (enhancementText?: string, formatOptions?: any) => {
      setIsGenerating(true);
      setError(null);
      setDebugInfo(null);
      setRawResponse(null);
      setParseResults(null);
      setProgress(0);

      // Setup progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Increase by a random amount up to 85%
          const newValue = Math.min(prev + Math.random() * 5, 85);
          return newValue;
        });
      }, 1000);

      try {
        const result = await generateUspCanvasProfile(
          strategyId,
          briefingContent,
          'all',
          enhancementText,
          personaContent,
          formatOptions
        );

        // Clear interval and set to 100% when done
        clearInterval(progressInterval);
        setProgress(100);
        setRawResponse(result);

        if (result.error) {
          setError(result.error);
          setDebugInfo(result.debugInfo);
          toast.error(`AI Generation Failed: ${result.error}`);
          return;
        }

        if (result.data) {
          // Parse results and set state
          const { jobs = [], pains = [], gains = [], rawOutput = '' } = result.data;
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

          // Validate results - we need at least one item in each category
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
          
          // Show appropriate toast based on completeness
          if (isComplete) {
            toast.success('AI Generation Complete!');
          } else {
            toast.success('AI Generation Completed with Partial Results', {
              description: 'Some sections may not have been fully parsed. Check the results.'
            });
          }
        } else {
          setError('No data received from AI service.');
          toast.error('AI Generation Failed: No data received.');
        }
      } catch (e: any) {
        // Clear interval on error
        clearInterval(progressInterval);
        setProgress(0);
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
    setShowDebug,
    progress // Add progress to returned values
  };
};
