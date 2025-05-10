
import { useState, useCallback } from 'react';
import { StoredAIResult } from '../types';
import { generateUspCanvasProfile } from '@/services/ai/uspCanvasService';
import { useAgentPrompt } from '@/hooks/useAgentPrompt';

interface GenerationOptions {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  onResultsGenerated?: (results: StoredAIResult, debugInfo?: any) => void;
}

export const useAIGenerator = (
  strategyId: string,
  briefingContent: string,
  personaContent?: string,
  onResultsGenerated?: (results: StoredAIResult, debugInfo?: any) => void
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const { ensurePromptExists } = useAgentPrompt('usp_canvas');

  const parseResults = useCallback((rawResponse: any) => {
    if (!rawResponse || !rawResponse.data) {
      return {
        jobsFound: 0,
        painsFound: 0,
        gainsFound: 0,
      };
    }

    const jobsFound = Array.isArray(rawResponse.data.jobs) ? rawResponse.data.jobs.length : 0;
    const painsFound = Array.isArray(rawResponse.data.pains) ? rawResponse.data.pains.length : 0;
    const gainsFound = Array.isArray(rawResponse.data.gains) ? rawResponse.data.gains.length : 0;

    return {
      jobsFound,
      painsFound,
      gainsFound,
    };
  }, []);

  const generateResult = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setDebugInfo(null);
    setRawResponse(null);
    setProgress(0);

    try {
      // Before proceeding, ensure the prompts exist for this module
      const promptsExist = await ensurePromptExists();
      console.log(`Prompt check for usp_canvas: ${promptsExist ? 'Available' : 'Not available'}`);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      // Generate all three profiles
      const jobsPromise = generateUspCanvasProfile(strategyId, briefingContent, 'jobs', undefined, personaContent);
      const painsPromise = generateUspCanvasProfile(strategyId, briefingContent, 'pains', undefined, personaContent);
      const gainsPromise = generateUspCanvasProfile(strategyId, briefingContent, 'gains', undefined, personaContent);

      const [jobsResult, painsResult, gainsResult] = await Promise.all([jobsPromise, painsPromise, gainsPromise]);

      clearInterval(progressInterval);

      // Combine the results
      const combinedResult: StoredAIResult = {
        jobs: jobsResult.data?.jobs || [],
        pains: painsResult.data?.pains || [],
        gains: gainsResult.data?.gains || [],
      };

      // Set raw response and debug info
      const newGenerationHistory = [
        {
          jobs: jobsResult.debugInfo,
          pains: painsResult.debugInfo,
          gains: gainsResult.debugInfo,
        },
        ...generationHistory,
      ];

      setRawResponse({
        jobs: jobsResult,
        pains: painsResult,
        gains: gainsResult,
      });
      setDebugInfo(newGenerationHistory);
      setGenerationHistory(newGenerationHistory);

      // Notify parent component about the generated results
      onResultsGenerated?.(combinedResult, newGenerationHistory);

      setProgress(100);
    } catch (e: any) {
      console.error("Error generating USP Canvas results:", e);
      setError(e.message || "An error occurred while generating results.");
    } finally {
      setIsGenerating(false);
    }
  }, [strategyId, briefingContent, personaContent, onResultsGenerated, ensurePromptExists, generationHistory]);

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
    progress
  };
};
