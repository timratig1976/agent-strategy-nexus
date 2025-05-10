
import { useState } from 'react';
import { UspCanvas } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Define a simplified history entry type to avoid circular references
export interface CanvasHistoryEntry {
  id: string;
  timestamp: number;
  isFinal: boolean;
  metadata: Record<string, any>;
  data: UspCanvas;
}

export const useCanvasDatabase = (strategyId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch canvas data from database
  const fetchCanvasData = async (): Promise<{ 
    canvas: UspCanvas | null, 
    history: CanvasHistoryEntry[] 
  }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, try to get the latest final version of canvas
      const { data: agentResults, error: resultsError } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('metadata->type', 'pain_gains')
        .eq('metadata->is_final', true)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;

      let canvas = null;
      
      if (agentResults && agentResults.length > 0) {
        // We found a final version
        try {
          canvas = JSON.parse(agentResults[0].content) as UspCanvas;
        } catch (e) {
          console.error("Error parsing canvas data:", e);
          setError("Failed to parse saved canvas data");
        }
      } else {
        // If no final version found, try to get the latest draft/working version
        const { data: draftResults, error: draftError } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', strategyId)
          .eq('metadata->type', 'pain_gains')
          .order('created_at', { ascending: false });
          
        if (draftError) throw draftError;
        
        if (draftResults && draftResults.length > 0) {
          try {
            canvas = JSON.parse(draftResults[0].content) as UspCanvas;
          } catch (e) {
            console.error("Error parsing draft canvas data:", e);
            setError("Failed to parse saved canvas draft");
          }
        }
      }
      
      // Load canvas history
      const history = await loadCanvasSaveHistory();
      
      return { canvas, history };
    } catch (err) {
      console.error("Error fetching canvas data:", err);
      setError("Failed to load canvas data");
      return { canvas: null, history: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Load canvas save history
  const loadCanvasSaveHistory = async (): Promise<CanvasHistoryEntry[]> => {
    try {
      const { data: historyResults, error: historyError } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('metadata->type', 'pain_gains')
        .order('created_at', { ascending: false });
        
      if (historyError) throw historyError;
      
      if (historyResults) {
        const history: CanvasHistoryEntry[] = historyResults.map(result => {
          // Parse the content safely
          let parsedData: UspCanvas;
          try {
            parsedData = JSON.parse(result.content) as UspCanvas;
          } catch (e) {
            console.error("Error parsing history entry:", e);
            parsedData = {
              customerJobs: [],
              customerPains: [],
              customerGains: [],
              productServices: [],
              painRelievers: [],
              gainCreators: []
            };
          }
          
          // Safely check if metadata has is_final property
          let isFinal = false;
          if (result.metadata && typeof result.metadata === 'object' && 
              'is_final' in (result.metadata as Record<string, any>)) {
            isFinal = !!(result.metadata as Record<string, any>).is_final;
          }
          
          return {
            id: result.id,
            timestamp: new Date(result.created_at).getTime(),
            data: parsedData,
            isFinal: isFinal,
            metadata: result.metadata as Record<string, any>
          };
        });
        
        return history;
      }
      return [];
    } catch (err) {
      console.error("Error loading canvas history:", err);
      return [];
    }
  };

  // Save to database
  const saveToDatabase = async (canvas: UspCanvas, isFinal: boolean = false) => {
    try {
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(canvas),
          metadata: {
            type: 'pain_gains',
            is_final: isFinal,
            updated_at: new Date().toISOString()
          }
        });
      
      if (error) throw error;
      
      toast.success(isFinal ? "Canvas saved as final version to database!" : "Canvas saved to database!");
      return true;
    } catch (err) {
      console.error("Error saving canvas to database:", err);
      toast.error("Failed to save to database");
      return false;
    }
  };

  return {
    fetchCanvasData,
    loadCanvasSaveHistory,
    saveToDatabase,
    isLoading,
    error
  };
};
