
import { useState, useEffect, useCallback } from 'react';
import { UspCanvasAIResult } from '@/services/ai/types';
import { supabase } from '@/integrations/supabase/client';
import useUspCanvasData from './useUspCanvasData';

interface GeneratedStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAIGenerated: boolean;
  createdAt: string;
}

interface GeneratedStatements {
  painStatements: GeneratedStatement[];
  gainStatements: GeneratedStatement[];
}

const useStatementsGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { uspCanvasData, isLoading: isLoadingCanvasData } = useUspCanvasData(strategyId);
  
  // Generate statements using AI
  const generateStatements = useCallback(
    async (customPrompt: string = ''): Promise<GeneratedStatements> => {
      if (!strategyId) {
        throw new Error('Strategy ID is required');
      }

      try {
        setIsGenerating(true);
        setProgress(10);
        
        const payload = {
          strategy_id: strategyId,
          usp_canvas_data: uspCanvasData,
          custom_prompt: customPrompt || ''
        };
        
        setProgress(30);
        
        // Call the Edge function to generate statements
        const { data, error } = await supabase.functions.invoke('statements-generator', {
          body: JSON.stringify(payload)
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setProgress(90);
        
        // Return the generated statements
        return {
          painStatements: data?.painStatements || [],
          gainStatements: data?.gainStatements || []
        };
      } catch (err: any) {
        console.error('Error generating statements:', err);
        setError(err.message);
        throw err;
      } finally {
        setProgress(100);
        setIsGenerating(false);
      }
    },
    [strategyId, uspCanvasData]
  );
  
  return {
    generateStatements,
    isGenerating,
    progress,
    error,
    uspCanvasData,
    isLoadingCanvasData
  };
};

export default useStatementsGenerator;
