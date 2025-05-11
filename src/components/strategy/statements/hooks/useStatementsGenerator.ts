
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { StatementsGeneratorService, GeneratedStatements } from '../services/statementsGeneratorService';
import { parseGeneratedStatements } from '../utils/statementsParser';

interface UseStatementsGeneratorProps {
  strategyId?: string;
}

/**
 * Hook for generating statements with AI
 */
export const useStatementsGenerator = ({ strategyId }: UseStatementsGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Generate statements with AI
  const generateStatements = useCallback(async (uspData: any) => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return { painStatements: [], gainStatements: [] };
    }

    try {
      setIsGenerating(true);
      setProgressPercent(10);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgressPercent(prev => Math.min(prev + 5, 90));
      }, 1000);

      // Generate statements using the service
      const rawGenerated = await StatementsGeneratorService.generateStatements(
        strategyId, 
        uspData
      );
      
      // Parse the generated statements
      const parsed = parseGeneratedStatements(rawGenerated.rawOutput || '');

      clearInterval(progressInterval);
      setProgressPercent(100);

      return {
        painStatements: parsed.painStatements,
        gainStatements: parsed.gainStatements
      };
    } catch (error: any) {
      console.error('Error generating statements:', error);
      toast.error(error.message || 'Failed to generate statements');
      return { painStatements: [], gainStatements: [] };
    } finally {
      setIsGenerating(false);
      setProgressPercent(0);
    }
  }, [strategyId]);

  return {
    generateStatements,
    isGenerating,
    progressPercent
  };
};

export default useStatementsGenerator;
