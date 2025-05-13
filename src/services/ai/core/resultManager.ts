
import { supabase } from '@/integrations/supabase/client';
import { AgentResult } from '@/types/marketing';

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
      // Insert the agent result into the database
      const { data, error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          agent_id: agentId,
          content: content,
          metadata: metadata
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving agent result:", error);
        return null;
      }

      // Map the database result to the AgentResult type
      return {
        id: data.id,
        agentId: data.agent_id || '',
        strategyId: data.strategy_id,
        content: data.content,
        createdAt: data.created_at,
        metadata: data.metadata
      };
    } catch (error) {
      console.error("Exception saving agent result:", error);
      return null;
    }
  }
}
