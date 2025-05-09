
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

/**
 * Hook for managing AI prompt templates
 */
export const usePromptManager = () => {
  // Function to ensure prompts exist for a given module
  const ensurePromptsExist = useCallback(async (module: string): Promise<boolean> => {
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
      
      // Default prompts for different modules
      let systemPrompt = '';
      let userPrompt = '';
      
      // Set default prompts based on the module
      if (module === 'briefing') {
        systemPrompt = `You are an expert marketing strategist AI assistant helping to create professional marketing strategy briefings.

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
Maintain a professional tone suitable for marketing experts while being accessible.`;

        userPrompt = `I need to create a marketing strategy briefing for:
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
{{/if}}`;
      } else if (module === 'persona') {
        // Default prompts for persona module
        systemPrompt = `You are an expert marketing strategist specializing in persona development.`;
        userPrompt = `Based on the briefing content, create detailed buyer personas.
{{briefingContent}}

{{#if enhancementText}}
Additional guidance: {{enhancementText}}
{{/if}}`;
      }
      
      // If we have default prompts for this module, create them in the database
      if (systemPrompt && userPrompt) {
        const { error: insertError } = await supabase
          .from('ai_prompts')
          .insert({
            module,
            system_prompt: systemPrompt,
            user_prompt: userPrompt
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
  }, []);

  return { ensurePromptsExist };
};
