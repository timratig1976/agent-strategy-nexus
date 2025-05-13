
import { supabase } from '@/integrations/supabase/client';
import { PromptManager } from './core/promptManager';
import { ResultManager } from './core/resultManager';
import { AgentResult } from '@/types/marketing';

export class AgentCoreService {
  /**
   * Get default prompt templates for a given module
   * @param module The module name
   * @returns The default prompt templates or null if not available
   */
  static getDefaultPromptTemplates(module: string) {
    return PromptManager.getDefaultPromptTemplates(module);
  }
  
  /**
   * Ensure that prompts exist for a given module
   * @param module The module name
   * @returns True if prompts exist or were created successfully
   */
  static async ensurePromptsExist(module: string): Promise<boolean> {
    return await PromptManager.ensurePromptsExist(module);
  }
  
  /**
   * Update or create an AI prompt for a specific module
   */
  static async updateOrCreatePrompt(module: string, systemPrompt: string, userPrompt: string) {
    if (!module || !systemPrompt || !userPrompt) {
      return { error: 'Module name, system prompt, and user prompt are required' };
    }
    
    try {
      // Check if prompt exists
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('module', module)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error(`Error checking prompt for module ${module}:`, error);
        return { error: error.message };
      }
      
      // Update or create
      if (data) {
        // Update existing prompt
        const { error: updateError } = await supabase
          .from('ai_prompts')
          .update({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
        
        if (updateError) {
          console.error(`Error updating prompt for module ${module}:`, updateError);
          return { error: updateError.message };
        }
        
        return { success: true, operation: 'updated' };
      } else {
        // Create new prompt
        const { error: insertError } = await supabase
          .from('ai_prompts')
          .insert({
            module,
            system_prompt: systemPrompt,
            user_prompt: userPrompt
          });
        
        if (insertError) {
          console.error(`Error creating prompt for module ${module}:`, insertError);
          return { error: insertError.message };
        }
        
        return { success: true, operation: 'created' };
      }
    } catch (err: any) {
      console.error(`Error updating/creating prompt for module ${module}:`, err);
      return { error: err.message };
    }
  }
  
  /**
   * Get prompt templates for a module with fallback to defaults
   * @param module The module name
   * @returns The prompt templates with source information
   */
  static async getPrompts(module: string) {
    return await PromptManager.getPrompts(module);
  }
  
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
    return await ResultManager.saveAgentResult(strategyId, content, metadata, agentId);
  }
}
