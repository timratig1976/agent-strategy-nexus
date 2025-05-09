
import { supabase } from "@/integrations/supabase/client";
import { AgentResult } from "@/types/marketing";

export class ResultManager {
  /**
   * Save an agent result to the database
   * @param strategyId The strategy ID
   * @param content The content to save
   * @param metadata Additional metadata
   * @param agentId The agent ID (optional)
   * @returns The saved result or null if failed
   */
  static async saveAgentResult(
    strategyId: string,
    content: string,
    metadata: Record<string, any> = {},
    agentId: string | null = null
  ): Promise<AgentResult | null> {
    try {
      if (!strategyId || !content) {
        throw new Error("Strategy ID and content are required");
      }
      
      // Create a new result record
      const { data, error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content,
          metadata,
          agent_id: agentId
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error saving agent result:", error);
        throw error;
      }
      
      // Map the snake_case database columns to camelCase interface properties
      if (data) {
        const result: AgentResult = {
          id: data.id,
          agentId: data.agent_id,
          strategyId: data.strategy_id,
          content: data.content,
          createdAt: data.created_at,
          // Ensure metadata is an object or default to empty object
          metadata: typeof data.metadata === 'object' && data.metadata !== null 
            ? data.metadata as Record<string, any> 
            : {}
        };
        return result;
      }
      
      return null;
    } catch (err) {
      console.error("Error in saveAgentResult:", err);
      return null;
    }
  }
}
