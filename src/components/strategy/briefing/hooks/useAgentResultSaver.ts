
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";

export const useAgentResultSaver = () => {
  // Save agent result as a new record with content and optional metadata
  const saveAgentResult = async (
    strategyId: string, 
    content: string, 
    metadata: Record<string, any> = {}
  ): Promise<AgentResult> => {
    try {
      console.log("Saving new agent result:", { strategyId, content, metadata });
      
      if (!content.trim()) {
        throw new Error("Content is empty");
      }
      
      // If this is a final version, update all previous final versions to not be final
      if (metadata.is_final === true) {
        console.log("Saving as final. Updating previous final versions...");
        
        // First, find the type of result we're saving (briefing, persona, etc.)
        const resultType = metadata.type || 'briefing';
        
        // Remove 'final' status from all previous results of the same type
        // Using a direct SQL query instead of RPC to avoid type issues
        const { error: updateError } = await supabase
          .from('agent_results')
          .update({ 
            metadata: {
              is_final: false
            }
          })
          .eq('strategy_id', strategyId)
          .eq('metadata->is_final', 'true')
          .eq('metadata->type', resultType);
        
        if (updateError) {
          console.error("Error updating previous final results:", updateError);
        }
      }
      
      // Now insert the new record
      const newRecord = {
        agent_id: null,
        strategy_id: strategyId,
        content: content.trim(),
        metadata: metadata
      };
      
      const { data, error } = await supabase
        .from('agent_results')
        .insert(newRecord)
        .select('*')
        .single();
      
      if (error) {
        console.error("Error saving agent result:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("No data returned from insert");
      }
      
      console.log("Agent result saved successfully:", data);
      
      // Format the saved result to match the AgentResult type
      const formattedResult: AgentResult = {
        id: data.id,
        agentId: data.agent_id,
        strategyId: data.strategy_id,
        content: data.content,
        createdAt: data.created_at,
        metadata: (typeof data.metadata === 'object' && data.metadata !== null) 
          ? data.metadata 
          : {}
      };
      
      return formattedResult;
    } catch (error) {
      console.error("Error in saveAgentResult:", error);
      toast.error("Failed to save result");
      throw error;
    }
  };

  return { saveAgentResult };
};
