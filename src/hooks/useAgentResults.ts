
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentCoreService } from '@/services/ai/agentCoreService';

interface AgentResult {
  id: string;
  agentId: string | null;
  strategyId: string;
  content: string;
  createdAt: string;
  metadata: Record<string, any>;
}

interface UseAgentResultsOptions {
  strategyId: string;
  agentId?: string | null;
  type?: string;
  limit?: number;
  autoLoad?: boolean;
}

export const useAgentResults = (options: UseAgentResultsOptions) => {
  const [results, setResults] = useState<AgentResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch results from database
  const fetchResults = useCallback(async () => {
    const { strategyId, agentId, type, limit = 50 } = options;
    
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (agentId) {
        query = query.eq('agent_id', agentId);
      }
      
      // If type is specified, filter by metadata.type
      if (type) {
        query = query.contains('metadata', { type });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Map database results to our interface
        const mappedResults: AgentResult[] = data.map(item => ({
          id: item.id,
          agentId: item.agent_id,
          strategyId: item.strategy_id,
          content: item.content,
          createdAt: item.created_at,
          metadata: item.metadata as Record<string, any> || {}
        }));
        
        setResults(mappedResults);
      }
    } catch (error: any) {
      console.error('Error fetching agent results:', error);
      setError(error.message || 'Failed to fetch results');
    } finally {
      setIsLoading(false);
    }
  }, [options]);
  
  // Load results on mount if autoLoad is true
  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchResults();
    }
  }, [fetchResults, options.autoLoad]);
  
  // Save new result
  const saveResult = useCallback(async (
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<AgentResult | null> => {
    const { strategyId, agentId } = options;
    
    const result = await AgentCoreService.saveAgentResult(
      strategyId,
      content,
      metadata,
      agentId || null
    );
    
    if (result) {
      // Update local state with new result at the beginning
      setResults(prev => [result as AgentResult, ...prev]);
      return result as AgentResult;
    }
    
    return null;
  }, [options]);
  
  // Mark result as final
  const markAsFinal = useCallback(async (resultId: string): Promise<boolean> => {
    try {
      // Get the result to update
      const resultToUpdate = results.find(r => r.id === resultId);
      
      if (!resultToUpdate) {
        toast.error('Result not found');
        return false;
      }
      
      // Update the metadata with is_final flag
      const updatedMetadata = {
        ...resultToUpdate.metadata,
        is_final: true,
        finalized_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('agent_results')
        .update({ metadata: updatedMetadata })
        .eq('id', resultId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setResults(prev => prev.map(item => 
        item.id === resultId 
          ? { ...item, metadata: updatedMetadata }
          : item
      ));
      
      toast.success('Result marked as final');
      return true;
    } catch (error: any) {
      console.error('Error marking result as final:', error);
      toast.error('Failed to mark result as final');
      return false;
    }
  }, [results]);
  
  // Check if there's a final result
  const hasFinalResult = results.some(result => 
    result.metadata && result.metadata.is_final === true
  );
  
  // Get the latest final result
  const latestFinalResult = results.find(result => 
    result.metadata && result.metadata.is_final === true
  );
  
  // Get the latest result (final or not)
  const latestResult = results.length > 0 ? results[0] : null;

  return {
    results,
    isLoading,
    error,
    fetchResults,
    saveResult,
    markAsFinal,
    hasFinalResult,
    latestFinalResult,
    latestResult
  };
};
