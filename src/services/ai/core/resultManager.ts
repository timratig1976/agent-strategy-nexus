
import { supabase } from '@/integrations/supabase/client';

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
  ): Promise<any | null> {
    try {
      // If this is marked as final, first update all other results of the same type
      if (metadata && metadata.is_final === true && metadata.type) {
        await supabase.rpc('update_agent_results_final_status', {
          strategy_id_param: strategyId,
          result_type_param: metadata.type
        });
      }
      
      // Save the new result
      const { data, error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          agent_id: agentId,
          content,
          metadata
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error saving agent result:', error);
        return null;
      }
      
      // Map from snake_case to camelCase
      const result = {
        id: data.id,
        agentId: data.agent_id,
        strategyId: data.strategy_id,
        content: data.content,
        createdAt: data.created_at,
        metadata: data.metadata || {}
      };
      
      return result;
      
    } catch (error) {
      console.error('Error in saveAgentResult:', error);
      return null;
    }
  }
}
