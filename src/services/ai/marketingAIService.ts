
import { supabase } from "@/integrations/supabase/client";
import { AIPrompt, AIServiceResponse, FormatOptions } from "./types";

export class MarketingAIService {
  static async generateContent<T>(
    module: string, 
    action: 'generate' | 'edit', 
    data: any,
    formatOptions?: FormatOptions
  ): Promise<AIServiceResponse<T>> {
    try {
      console.log('Sending request to AI service:', { module, action, data, formatOptions });
      
      // We no longer use separate _de modules, just pass the output language as a parameter
      const response = await supabase.functions.invoke('marketing-ai', {
        body: { 
          module, 
          action, 
          data: {
            ...data,
            formatOptions: formatOptions || data.formatOptions
          }
        }
      });
      
      if (response.error) {
        console.error('Error invoking marketing AI function:', response.error);
        return { 
          error: response.error.message || 'Failed to generate content',
          debugInfo: {
            requestData: { module, action, data },
            responseData: response.error
          }
        };
      }
      
      return { 
        data: response.data.result as T,
        debugInfo: {
          requestData: { module, action, data },
          responseData: response.data
        }
      };
    } catch (error) {
      console.error('Error in marketing AI service:', error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating content',
        debugInfo: {
          requestData: { module, action, data }
        }
      };
    }
  }

  static async getPrompts(): Promise<AIServiceResponse<AIPrompt[]>> {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return { 
        data: data.map(prompt => ({
          id: prompt.id,
          module: prompt.module,
          systemPrompt: prompt.system_prompt,
          userPrompt: prompt.user_prompt,
          createdAt: prompt.created_at,
          updatedAt: prompt.updated_at
        }))
      };
    } catch (error) {
      console.error('Error fetching AI prompts:', error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching prompts' 
      };
    }
  }

  static async getPromptByModule(module: string): Promise<AIServiceResponse<AIPrompt>> {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('module', module)
        .maybeSingle();
      
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return { error: `No prompt found for module: ${module}` };
        }
        throw error;
      }
      
      if (!data) {
        return { error: `No prompt found for module: ${module}` };
      }
      
      return { 
        data: {
          id: data.id,
          module: data.module,
          systemPrompt: data.system_prompt,
          userPrompt: data.user_prompt,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      };
    } catch (error) {
      console.error(`Error fetching AI prompt for module ${module}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching the prompt' 
      };
    }
  }

  static async savePrompt(
    prompt: Partial<AIPrompt> & { module: string }
  ): Promise<AIServiceResponse<AIPrompt>> {
    try {
      const { data: existingPrompt, error: fetchError } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('module', prompt.module)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let result;
      
      if (existingPrompt) {
        // Update existing prompt
        result = await supabase
          .from('ai_prompts')
          .update({
            system_prompt: prompt.systemPrompt,
            user_prompt: prompt.userPrompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPrompt.id)
          .select()
          .single();
      } else {
        // Insert new prompt
        result = await supabase
          .from('ai_prompts')
          .insert({
            module: prompt.module,
            system_prompt: prompt.systemPrompt,
            user_prompt: prompt.userPrompt
          })
          .select()
          .single();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      return { 
        data: {
          id: result.data.id,
          module: result.data.module,
          systemPrompt: result.data.system_prompt,
          userPrompt: result.data.user_prompt,
          createdAt: result.data.created_at,
          updatedAt: result.data.updated_at
        }
      };
    } catch (error) {
      console.error(`Error saving AI prompt for module ${prompt.module}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while saving the prompt' 
      };
    }
  }
}
