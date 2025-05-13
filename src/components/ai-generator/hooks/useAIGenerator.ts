
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AIGenerationResult } from '../types';

interface UseAIGeneratorOptions<T extends AIGenerationResult> {
  strategyId?: string;
  module: string;
  initialHistory?: T[];
  onSaveSuccess?: (result: T, isFinal: boolean) => void;
  fetchGenerationHistory?: () => Promise<T[]>;
  saveGenerationResult?: (content: string, isFinal: boolean) => Promise<T | null>;
  generateFunction?: (enhancementText?: string) => Promise<{ content: string; metadata?: Record<string, any> } | null>;
}

/**
 * Custom hook for managing AI generation state and actions
 */
export function useAIGenerator<T extends AIGenerationResult>({
  strategyId,
  module,
  initialHistory = [],
  onSaveSuccess,
  fetchGenerationHistory,
  saveGenerationResult,
  generateFunction
}: UseAIGeneratorOptions<T>) {
  // State management
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  const [generationHistory, setGenerationHistory] = useState<T[]>(initialHistory);
  const [latestGeneration, setLatestGeneration] = useState<T | null>(initialHistory[0] || null);
  const [editedContent, setEditedContent] = useState(latestGeneration?.content || '');
  const [enhancementText, setEnhancementText] = useState('');
  const [enhancerExpanded, setEnhancerExpanded] = useState(true);
  const [showPromptMonitor, setShowPromptMonitor] = useState(false);

  // Fetch history from API
  const fetchHistory = useCallback(async () => {
    if (fetchGenerationHistory) {
      try {
        const history = await fetchGenerationHistory();
        setGenerationHistory(history);
        if (history.length > 0) {
          setLatestGeneration(history[0]);
          setEditedContent(history[0].content);
        }
      } catch (error) {
        console.error(`Error fetching ${module} history:`, error);
      }
    }
  }, [module, fetchGenerationHistory]);

  // Generate content
  const generateContent = useCallback(async (customEnhancementText?: string) => {
    if (!generateFunction) {
      toast.error(`Generate function not provided for ${module}`);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const result = await generateFunction(customEnhancementText || enhancementText);
      
      if (!result) {
        throw new Error('Generation failed: No content returned');
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      // Update the latest generation with the result
      if (latestGeneration) {
        const updatedGeneration = {
          ...latestGeneration,
          content: result.content,
          metadata: {
            ...latestGeneration.metadata,
            ...result.metadata
          }
        } as T;
        
        setLatestGeneration(updatedGeneration);
        setEditedContent(result.content);
      } else {
        // No existing generation, create a placeholder
        const newGeneration = {
          content: result.content,
          metadata: result.metadata || {}
        } as T;
        
        setLatestGeneration(newGeneration);
        setEditedContent(result.content);
      }

      toast.success(`${module} generated successfully`);
      
    } catch (error) {
      console.error(`Error generating ${module}:`, error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error(`Failed to generate ${module}`);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setProgress(0);
    }
  }, [enhancementText, generateFunction, latestGeneration, module]);

  // Save content
  const saveContent = useCallback(async (isFinal: boolean) => {
    if (!saveGenerationResult) {
      toast.error(`Save function not provided for ${module}`);
      return;
    }

    try {
      const savedResult = await saveGenerationResult(editedContent, isFinal);
      
      if (!savedResult) {
        throw new Error('Save failed: No result returned');
      }
      
      // Update history and latest generation
      setGenerationHistory(prev => [savedResult, ...prev.filter(item => item.id !== savedResult.id)]);
      setLatestGeneration(savedResult);
      
      // Call success callback if provided
      if (onSaveSuccess) {
        onSaveSuccess(savedResult, isFinal);
      }
      
      toast.success(isFinal ? `${module} saved as final` : `${module} draft saved`);
      return savedResult;
    } catch (error) {
      console.error(`Error saving ${module}:`, error);
      toast.error(`Failed to save ${module}`);
      return null;
    }
  }, [editedContent, module, onSaveSuccess, saveGenerationResult]);

  // Toggle handlers
  const toggleEnhancerExpanded = useCallback(() => {
    setEnhancerExpanded(prev => !prev);
  }, []);

  const togglePromptMonitor = useCallback(() => {
    setShowPromptMonitor(prev => !prev);
  }, []);

  return {
    // State
    isGenerating,
    progress,
    error,
    aiDebugInfo,
    generationHistory,
    latestGeneration,
    editedContent,
    enhancementText,
    enhancerExpanded,
    showPromptMonitor,
    
    // Setters
    setEditedContent,
    setEnhancementText,
    setAiDebugInfo,
    
    // Actions
    generateContent,
    saveContent,
    fetchHistory,
    toggleEnhancerExpanded,
    togglePromptMonitor
  };
}
