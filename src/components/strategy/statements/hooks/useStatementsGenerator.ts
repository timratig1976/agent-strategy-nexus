
import { useState, useCallback } from 'react';
import useUspCanvasData from './useUspCanvasData';
import { StatementsGeneratorService } from '../services/statementsGeneratorService';

/**
 * Hook for generating statements from USP Canvas data
 */
export const useStatementsGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Get USP Canvas data
  const {
    uspCanvasData,
    isLoading: isLoadingCanvasData,
    error: canvasError
  } = useUspCanvasData(strategyId);

  /**
   * Generate statements from USP Canvas data
   */
  const generateStatements = useCallback(async (
    additionalPrompt: string = '',
    outputLanguage: string = 'english'
  ) => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(10);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Generate statements
      const result = await StatementsGeneratorService.generateStatements(
        strategyId,
        uspCanvasData
      );

      clearInterval(progressInterval);

      if (result.error) {
        setError(result.error);
        setProgress(0);
        return { painStatements: [], gainStatements: [] };
      }

      // Store debug info
      setDebugInfo(result.debugInfo);
      
      setProgress(100);
      return {
        painStatements: result.painStatements || [],
        gainStatements: result.gainStatements || []
      };
    } catch (error: any) {
      console.error("Error generating statements:", error);
      setError(error.message || "Failed to generate statements");
      setProgress(0);
      return { painStatements: [], gainStatements: [] };
    } finally {
      setIsGenerating(false);
    }
  }, [strategyId, uspCanvasData]);

  return {
    generateStatements,
    isGenerating,
    progress,
    error,
    uspCanvasData,
    isLoadingCanvasData,
    canvasError,
    debugInfo
  };
};

export default useStatementsGenerator;
