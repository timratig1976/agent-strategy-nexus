
import { useState, useEffect } from "react";
import { AgentResult } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";

export const useBriefingHistory = (strategyId: string) => {
  const [briefingHistory, setBriefingHistory] = useState<AgentResult[]>([]);

  const fetchBriefingHistory = async () => {
    try {
      console.log("Fetching briefing history for strategy ID:", strategyId);
      
      const { data, error } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching briefing history:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Briefing history data:", data);
        
        // Map the data from snake_case to camelCase and ensure metadata is properly typed
        const formattedResults: AgentResult[] = data.map(result => ({
          id: result.id,
          agentId: result.agent_id,
          strategyId: result.strategy_id,
          content: result.content,
          createdAt: result.created_at,
          // Ensure metadata is treated as a record by providing a default empty object
          metadata: (typeof result.metadata === 'object' && result.metadata !== null) 
            ? result.metadata as Record<string, any>
            : {} 
        }));

        setBriefingHistory(formattedResults);
        console.log("Formatted briefing history:", formattedResults);
      } else {
        console.log("No briefing history found");
      }
    } catch (error) {
      console.error("Error fetching briefing history:", error);
    }
  };

  // Set up real-time subscription for agent_results
  useEffect(() => {
    fetchBriefingHistory();

    const channel = supabase
      .channel('agent_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_results',
          filter: `strategy_id=eq.${strategyId}`
        },
        (payload) => {
          console.log('New agent result added:', payload);
          fetchBriefingHistory();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_results',
          filter: `strategy_id=eq.${strategyId}`
        },
        (payload) => {
          console.log('Agent result updated:', payload);
          fetchBriefingHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [strategyId]);

  return {
    briefingHistory,
    setBriefingHistory,
    fetchBriefingHistory
  };
};
