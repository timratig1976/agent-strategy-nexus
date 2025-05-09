
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MarketingAIService } from '@/services/marketingAIService';
import { useAgentPrompt } from './useAgentPrompt';

interface GenerationOptions {
  strategyId: string;
  module: string;
  action?: string;
  data?: Record<string, any>;
  retries?: number;
}

export const useAgentGeneration = (defaultOptions: GenerationOptions) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const { ensurePromptExists } = useAgentPrompt(defaultOptions.module);

  const generateContent = useCallback(async <T = any>(
    customData?: Record<string, any>,
    options?: Partial<GenerationOptions>
  ): Promise<{
    data: T | null;
    error: string | null;
    debugInfo: any;
  }> => {
    const finalOptions = {
      ...defaultOptions,
      ...options
    };
    
    const { strategyId, module, action = 'generate', retries = 1 } = finalOptions;
    
    try {
      setIsGenerating(true);
      setProgress(10);
      setError(null);
      setDebugInfo(null);
      setRawResponse(null);
      
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
      
      // Before proceeding, ensure the prompts exist for this module
      const promptsExist = await ensurePromptExists();
      console.log(`Prompt check for ${module}: ${promptsExist ? 'Available' : 'Not available'}`);
      
      // Generate the content using the AI service
      const mergedData = {
        strategyId,
        ...customData
      };
      
      console.log(`Generating content for module: ${module}, action: ${action}`);
      console.log(`Data passed to AI:`, mergedData);
      
      const result = await MarketingAIService.generateContent<T>(
        module,
        action,
        mergedData
      );
      
      clearInterval(progressInterval);
      
      setRawResponse(result);
      setDebugInfo(result.debugInfo);
      
      if (result.error) {
        setError(result.error);
        
        // If we have retries left and it's a "No prompts found" error, try again
        if (retries > 0 && result.error.includes("No prompts found")) {
          console.log("No prompts found. Attempting to create default prompts and retry...");
          
          const retryPromptCreation = await ensurePromptExists();
          
          if (retryPromptCreation) {
            console.log(`Default prompts created. Retrying ${module} generation...`);
            
            // Recursive call with one less retry
            return generateContent(customData, {
              ...options,
              retries: retries - 1
            });
          }
        }
        
        throw new Error(result.error);
      }
      
      setProgress(100);
      return {
        data: result.data,
        error: null,
        debugInfo: result.debugInfo
      };
      
    } catch (error: any) {
      console.error(`Error in ${module} generation:`, error);
      setError(error.message || 'Unknown error occurred');
      return {
        data: null,
        error: error.message || 'Unknown error occurred',
        debugInfo: null
      };
    } finally {
      setIsGenerating(false);
    }
  }, [defaultOptions, ensurePromptExists]);

  return {
    isGenerating,
    progress,
    error,
    debugInfo,
    rawResponse,
    generateContent,
    setProgress,
    setError,
    setDebugInfo
  };
};
