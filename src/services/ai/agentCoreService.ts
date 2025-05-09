
import { supabase } from '@/integrations/supabase/client';

// Define the prompt template structure
interface PromptTemplate {
  system_prompt: string;
  user_prompt: string;
}

// Default prompt templates for different modules
const DEFAULT_PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  'briefing': {
    system_prompt: `You are an expert marketing strategist helping businesses create effective marketing strategies. 
    Your task is to create a comprehensive marketing briefing based on the company and product information provided.`,
    user_prompt: `Please create a comprehensive marketing briefing for {{companyName}}.

Company Description:
{{companyDescription}}

Product/Service Description:
{{productDescription}}

Additional Information:
{{additionalInfo}}

Please structure the briefing into the following sections:
1. Company Overview
2. Industry Analysis
3. Target Audience
4. Marketing Objectives
5. Current Marketing Situation
6. SWOT Analysis
7. Key Messaging
8. Recommendations`
  },
  'persona': {
    system_prompt: `You are an expert in customer persona development for marketing strategies. 
    Create detailed, realistic customer personas based on the provided briefing and company information.`,
    user_prompt: `Based on the following marketing briefing, create 2-3 detailed customer personas that would be ideal target customers for the products/services described.

Marketing Briefing:
{{briefingContent}}

Additional Instructions:
{{enhancementText}}

For each persona, include:
1. Name and basic demographic information (age, occupation, income level, location)
2. Background and daily life
3. Goals and motivations
4. Pain points and challenges
5. Buying behavior and preferences
6. Media consumption habits
7. Objections or hesitations about the product/service`
  }
  // Add more default templates as needed
};

export class AgentCoreService {
  /**
   * Get default prompt templates
   */
  static getDefaultPromptTemplates(module: string): PromptTemplate | undefined {
    return DEFAULT_PROMPT_TEMPLATES[module];
  }
  
  /**
   * Ensure that prompts exist for a given module
   * @param module The module name
   * @returns True if prompts exist or were created successfully
   */
  static async ensurePromptsExist(module: string): Promise<boolean> {
    try {
      // Check if custom prompts exist in the database
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('module', module)
        .maybeSingle();
        
      if (error) {
        console.error(`Error checking prompts for module ${module}:`, error);
        return false;
      }
      
      // If prompts exist, return true
      if (data) {
        console.log(`Found existing prompt for module ${module}`);
        return true;
      }
      
      // If no prompts exist, try to create default prompts
      const defaultTemplate = DEFAULT_PROMPT_TEMPLATES[module];
      
      if (!defaultTemplate) {
        console.error(`No default template available for module ${module}`);
        return false;
      }
      
      // Create a new prompt with default template
      const { error: insertError } = await supabase
        .from('ai_prompts')
        .insert({
          module,
          system_prompt: defaultTemplate.system_prompt,
          user_prompt: defaultTemplate.user_prompt
        });
        
      if (insertError) {
        console.error(`Error creating default prompt for module ${module}:`, insertError);
        return false;
      }
      
      console.log(`Created default prompt for module ${module}`);
      return true;
      
    } catch (error) {
      console.error(`Error in ensurePromptsExist(${module}):`, error);
      return false;
    }
  }
  
  /**
   * Get prompt templates for a module with fallback to defaults
   * @param module The module name
   * @returns The prompt templates or null if not available
   */
  static async getPrompts(module: string): Promise<{
    system_prompt: string;
    user_prompt: string;
    source: 'database' | 'default';
  } | null> {
    try {
      // Try to get custom prompts from the database
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('module', module)
        .maybeSingle();
        
      if (error) {
        console.error(`Error fetching prompts for module ${module}:`, error);
        // Continue to try default prompts
      }
      
      // If custom prompts exist, return them
      if (data) {
        return {
          system_prompt: data.system_prompt,
          user_prompt: data.user_prompt,
          source: 'database'
        };
      }
      
      // If no custom prompts, try default templates
      const defaultTemplate = DEFAULT_PROMPT_TEMPLATES[module];
      
      if (defaultTemplate) {
        return {
          system_prompt: defaultTemplate.system_prompt,
          user_prompt: defaultTemplate.user_prompt,
          source: 'default'
        };
      }
      
      // If no prompts found anywhere, return null
      console.error(`No prompts found for module ${module}`);
      return null;
      
    } catch (error) {
      console.error(`Error in getPrompts(${module}):`, error);
      return null;
    }
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
