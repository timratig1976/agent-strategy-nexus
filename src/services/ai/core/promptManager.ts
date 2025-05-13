
import { supabase } from '@/integrations/supabase/client';

/**
 * Default prompt templates for various AI modules
 */
const DEFAULT_PROMPTS = {
  briefing: {
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
- Decision-making factors

{{#if formData.industry}}
Industry: {{formData.industry}}
{{/if}}

{{#if formData.productDescription}}
Product/Service Description: {{formData.productDescription}}
{{/if}}

{{#if formData.targetMarket}}
Target Market: {{formData.targetMarket}}
{{/if}}

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch und stelle sicher, dass die Personas für den deutschsprachigen Markt relevant sind.
{{/if}}`
  },
  usp_canvas: {
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
  },
  statements: {
    system_prompt: `You are an expert marketing strategist specializing in pain point and value proposition statement development.

Your task is to analyze the USP Canvas data and create compelling, actionable pain and gain statements that will resonate with the target audience and highlight the unique value of the product or service.

For each statement:
1. Focus on one specific pain point or gain
2. Make it clear and concise
3. Use the customer's language and perspective
4. Ensure it connects to the product/service's value proposition
5. Prioritize based on impact (high, medium, low)

Create a balanced set of both pain statements (problems the customer faces) and gain statements (benefits the customer seeks).
Format the output clearly, with pain statements and gain statements in separate sections.`,
    user_prompt: `Based on the USP Canvas data provided, create compelling pain and gain statements:

{{#if uspData}}
USP Canvas Data:
{{uspData}}
{{/if}}

{{#if customPrompt}}
Additional instructions:
{{customPrompt}}
{{/if}}

Please generate at least {{minStatements}} pain statements and {{minStatements}} gain statements. For each statement:
- Make it concise and customer-focused
- Assign an impact level (high, medium, low)
- Ensure it relates directly to a key customer need or product benefit

Format the output with clear sections for pain statements and gain statements.

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch und stelle sicher, dass die Statements für den deutschsprachigen Markt relevant sind.
{{/if}}`
  }
};

export class PromptManager {
  /**
   * Get default prompt templates for a given module
   * @param module The module name
   * @returns The default prompt templates or null if not available
   */
  static getDefaultPromptTemplates(module: string) {
    return DEFAULT_PROMPTS[module as keyof typeof DEFAULT_PROMPTS] || null;
  }
  
  /**
   * Ensure that prompts exist for a given module
   * @param module The module name
   * @returns True if prompts exist or were created successfully
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
      
      // Get default prompts for this module
      const defaultPrompts = this.getDefaultPromptTemplates(module);
      
      // If we have default prompts for this module, create them in the database
      if (defaultPrompts) {
        const { error: insertError } = await supabase
          .from('ai_prompts')
          .insert({
            module,
            system_prompt: defaultPrompts.system_prompt,
            user_prompt: defaultPrompts.user_prompt
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
   * Get prompt templates for a module with fallback to defaults
   * @param module The module name
   * @returns The prompt templates with source information
   */
  static async getPrompts(module: string) {
    try {
      // Check for database prompts first
      const { data: promptData, error: promptError } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('module', module)
        .maybeSingle();
      
      if (promptError && promptError.code !== 'PGRST116') {
        console.error(`Error fetching prompts for module ${module}:`, promptError);
      }
      
      // If database prompts exist, use them
      if (promptData && promptData.system_prompt && promptData.user_prompt) {
        return {
          system_prompt: promptData.system_prompt,
          user_prompt: promptData.user_prompt,
          source: 'database' as const
        };
      }
      
      // Otherwise, fall back to default prompts
      const defaultPrompts = this.getDefaultPromptTemplates(module);
      if (defaultPrompts) {
        return {
          system_prompt: defaultPrompts.system_prompt,
          user_prompt: defaultPrompts.user_prompt,
          source: 'default' as const
        };
      }
      
      // If no prompts found, return null
      return null;
    } catch (err) {
      console.error(`Error getting prompts for module ${module}:`, err);
      return null;
    }
  }
}
