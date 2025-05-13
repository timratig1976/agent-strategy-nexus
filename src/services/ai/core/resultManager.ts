
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
      // Ensure metadata is a proper object
      const metadataObj = typeof metadata === 'string' 
        ? JSON.parse(metadata) 
        : metadata;
        
      // Insert the agent result into the database
      const { data, error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          agent_id: agentId,
          content: content,
          // Use type assertion to handle JSON compatibility
          metadata: metadataObj as any // Force type for Supabase compatibility
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving agent result:", error);
        return null;
      }

      // Map the database result to the AgentResult type
      // Handle conversion from Supabase's Json type to our app's type
      return {
        id: data.id,
        agentId: data.agent_id || '',
        strategyId: data.strategy_id,
        content: data.content,
        createdAt: data.created_at,
        metadata: data.metadata as Record<string, any> // Use type assertion to handle the Json type
      };
    } catch (error) {
      console.error("Exception saving agent result:", error);
      return null;
    }
  }
}
