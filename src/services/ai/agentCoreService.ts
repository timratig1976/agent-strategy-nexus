
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AIPromptTemplate {
  module: string;
  system_prompt: string;
  user_prompt: string;
}

// Default prompt templates to use as fallbacks
export const DEFAULT_PROMPT_TEMPLATES: Record<string, AIPromptTemplate> = {
  briefing: {
    module: 'briefing',
    system_prompt: `You are an expert marketing strategist AI assistant helping to create professional marketing strategy briefings.

Your task is to synthesize information from multiple sources, including:
1. Form data provided by the user
2. Website content crawled from the company URL (when available)
3. Product description and additional context

Create a comprehensive, well-structured marketing strategy briefing that includes:
- Company and product overview based on the provided information and website data
- Target audience analysis that identifies key demographics and psychographics
- Unique value proposition and competitive positioning
- Key marketing channels and tactics recommended for this specific business
- Strategic approach recommendations tailored to the company's industry and offerings
- Prioritized action items and next steps

Format the briefing in a professional, readable structure with clear sections and bullet points where appropriate.
Maintain a professional tone suitable for marketing experts while being accessible.`,
    user_prompt: `I need to create a marketing strategy briefing for:
- Strategy ID: {{strategyId}}
- Strategy Name: {{formData.name}}
- Company Name: {{formData.companyName}}
- Website URL: {{formData.websiteUrl}}
- Product/Service Description: {{formData.productDescription}}
- Additional Information: {{formData.additionalInfo}}

{{#if websiteCrawlData}}
Here is additional data extracted from the company's website:
{{websiteCrawlData}}
{{/if}}

Please provide a comprehensive marketing strategy briefing that includes:
1. An overview of the company and its offerings
2. Target audience analysis
3. Key marketing channels to prioritize
4. Key benefits of the product/service to highlight
5. Recommendations for messaging and positioning
6. Call to action and next steps

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch.
{{/if}}`
  },
  persona: {
    module: 'persona',
    system_prompt: `You are an expert marketing strategist specializing in persona development.

Your task is to create detailed buyer personas based on the marketing briefing and any additional information provided.

For each persona, include:
1. A realistic name and brief description
2. Demographic information (age, gender, income, education, occupation, location)
3. Goals and objectives they are trying to achieve
4. Pain points and challenges they face
5. Behavioral traits and habits
6. Media consumption preferences and channels
7. Decision-making factors that influence their purchase decisions

Create 2-3 distinct personas that represent the primary customer segments for this business.
Format each persona in a clear, structured way that makes it easy to understand the different types of customers.`,
    user_prompt: `Based on the briefing content, create detailed buyer personas:

{{briefingContent}}

{{#if enhancementText}}
Additional guidance: {{enhancementText}}
{{/if}}

Please create 2-3 distinct, detailed buyer personas that represent the key customer segments for this business. For each persona include:
- Name and short description
- Demographics (age, gender, income, location, etc.)
- Goals and aspirations
- Pain points and challenges
- Behavioral traits
- Media preferences and channels
- Decision-making factors`
  },
  usp_canvas: {
    module: 'usp_canvas',
    system_prompt: `You are an expert marketing strategist specializing in value proposition and USP development.

Your task is to analyze the marketing briefing and persona information to develop a comprehensive USP Canvas with:
1. Customer Jobs - What tasks and goals customers are trying to accomplish
2. Customer Pains - Problems, frustrations, and challenges customers face
3. Customer Gains - Benefits and positive outcomes customers seek
4. Products & Services - What the business offers to customers
5. Pain Relievers - How products/services alleviate customer pains
6. Gain Creators - How products/services create customer gains

Format your output as structured sections with clear bullet points for each category.`,
    user_prompt: `Based on the provided information, create a USP Canvas that identifies:

{{#if briefingContent}}
Briefing Information:
{{briefingContent}}
{{/if}}

{{#if personaContent}}
Persona Information:
{{personaContent}}
{{/if}}

{{#if enhancementText}}
Additional guidance: {{enhancementText}}
{{/if}}

Please provide:
1. Customer Jobs - Key tasks and goals customers want to accomplish
2. Customer Pains - Main problems and challenges customers face
3. Customer Gains - Desired benefits and positive outcomes
4. Products & Services - What the business offers
5. Pain Relievers - How the offerings solve customer problems
6. Gain Creators - How the offerings deliver benefits`
  }
};

/**
 * Core service for AI agent operations
 */
export class AgentCoreService {
  /**
   * Ensures prompt templates exist for a given module
   * @param module Module name
   * @returns Boolean indicating if prompts exist or were created successfully
   */
  static async ensurePromptsExist(module: string): Promise<boolean> {
    try {
      if (!module) return false;
      
      // Check if prompts exist for the specified module
      const { data: promptData, error: promptError } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('module', module)
        .maybeSingle();
      
      // If there's an error or no data, and it's not just a not-found error, return false
      if (promptError && promptError.code !== 'PGRST116') {
        console.error(`Error checking prompts for module ${module}:`, promptError);
        return false;
      }
      
      // If we found a prompt, return true
      if (promptData) {
        console.log(`Prompts found for module ${module}`);
        return true;
      }
      
      // If we're here, then no prompts were found for this module
      console.log(`No prompts found for module ${module}. Creating default prompts...`);
      
      // Get default template for this module
      const template = DEFAULT_PROMPT_TEMPLATES[module];
      
      // If we have default prompts for this module, create them in the database
      if (template) {
        const { error: insertError } = await supabase
          .from('ai_prompts')
          .insert({
            module: template.module,
            system_prompt: template.system_prompt,
            user_prompt: template.user_prompt
          });
        
        if (insertError) {
          console.error(`Error creating default prompts for module ${module}:`, insertError);
          return false;
        }
        
        console.log(`Successfully created default prompts for module ${module}`);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error(`Error ensuring prompts exist for module ${module}:`, err);
      return false;
    }
  }

  /**
   * Gets prompts for a module with fallbacks
   * @param module Module name
   * @returns The prompt templates with fallbacks
   */
  static async getPrompts(module: string): Promise<{ 
    system_prompt: string; 
    user_prompt: string;
    source: 'database' | 'default';
  } | null> {
    try {
      // Get prompt from the database
      const { data: promptData, error: promptError } = await supabase
        .from('ai_prompts')
        .select('system_prompt, user_prompt')
        .eq('module', module)
        .maybeSingle();
      
      // If we found a prompt in the database, return it
      if (promptData && !promptError) {
        return {
          system_prompt: promptData.system_prompt,
          user_prompt: promptData.user_prompt,
          source: 'database'
        };
      }
      
      // If there's no prompt in the database, check if we have a default template
      const defaultTemplate = DEFAULT_PROMPT_TEMPLATES[module];
      if (defaultTemplate) {
        return {
          system_prompt: defaultTemplate.system_prompt,
          user_prompt: defaultTemplate.user_prompt,
          source: 'default'
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting prompts for module ${module}:`, error);
      return null;
    }
  }

  /**
   * Save agent result with standardized error handling
   * @param strategyId Strategy ID
   * @param agentId Agent ID (optional)
   * @param content Result content
   * @param metadata Result metadata
   * @returns The saved result or null on error
   */
  static async saveAgentResult(
    strategyId: string,
    content: string,
    metadata: Record<string, any> = {},
    agentId: string | null = null,
  ) {
    try {
      if (!content.trim()) {
        toast.error("Cannot save empty content");
        return null;
      }
      
      const { data, error } = await supabase
        .from("agent_results")
        .insert({
          agent_id: agentId,
          strategy_id: strategyId,
          content,
          metadata
        })
        .select("*")
        .single();
      
      if (error) {
        console.error("Error saving agent result:", error);
        toast.error("Failed to save result");
        return null;
      }
      
      // Map from snake_case to camelCase for consistency
      return {
        id: data.id,
        agentId: data.agent_id,
        strategyId: data.strategy_id,
        content: data.content,
        createdAt: data.created_at,
        metadata: data.metadata || {}
      };
      
    } catch (error) {
      console.error("Error in saveAgentResult:", error);
      toast.error("Failed to save result due to an unexpected error");
      return null;
    }
  }
}
