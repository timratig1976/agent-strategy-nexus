
import { useState, useCallback } from 'react';

interface UseAIContentGeneratorOptions<T> {
  generateContent: (prompt: string, options?: any) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialPrompt?: string;
  defaultOptions?: any;
}

export function useAIContentGenerator<T = any>(options: UseAIContentGeneratorOptions<T>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const [progress, setProgress] = useState(0);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    timestamp: number;
    prompt: string;
    result: T;
    options?: any;
  }>>([]);

  const generateContent = useCallback(async (prompt: string, customOptions?: any) => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      setProgress(10);
      
      // Simulate progress increments (since most APIs don't provide real-time progress)
      const progressInterval = setInterval(() => {
        setProgress(p => {
          const increment = Math.random() * 15;
          return Math.min(p + increment, 85); // Cap at 85%, save 15% for completion
        });
      }, 1000);
      
      // Merge default options with custom options
      const mergedOptions = {
        ...options.defaultOptions,
        ...customOptions
      };
      
      // Call the provided generate function with the prompt and options
      const generatedResult = await options.generateContent(prompt, mergedOptions);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      setProgress(100);
      
      // Set the result and add to history
      setResult(generatedResult);
      setGenerationHistory(prev => [
        {
          timestamp: Date.now(),
          prompt,
          result: generatedResult,
          options: mergedOptions
        },
        ...prev
      ]);
      
      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess(generatedResult);
      }
      
      return generatedResult;
    } catch (e: any) {
      const error = e instanceof Error ? e : new Error(e.message || 'Content generation failed');
      setGenerationError(error);
      
      // Call the error callback if provided
      if (options.onError) {
        options.onError(error);
      }
      
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [options]);
  
  return {
    generateContent,
    isGenerating,
    generationError,
    result,
    progress,
    generationHistory,
    reset: () => {
      setIsGenerating(false);
      setGenerationError(null);
      setProgress(0);
      setResult(null);
    }
  };
}
