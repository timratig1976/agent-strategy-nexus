
import { supabase } from "@/integrations/supabase/client";

export interface AIServiceResponse<T> {
  data?: T;
  error?: string;
  debugInfo?: {
    requestData?: any;
    responseData?: any;
  };
}

export interface AIPrompt {
  id: string;
  module: string;
  systemPrompt: string;
  userPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export class MarketingAIService {
  static async generateContent<T>(
    module: string, 
    action: 'generate' | 'edit', 
    data: any
  ): Promise<AIServiceResponse<T>> {
    try {
      console.log('Sending request to AI service:', { module, action, data });
      
      const { data: result, error } = await supabase.functions.invoke('marketing-ai', {
        body: { module, action, data }
      });
      
      if (error) {
        console.error('Error invoking marketing AI function:', error);
        return { 
          error: error.message || 'Failed to generate content',
          debugInfo: {
            requestData: { module, action, data },
            responseData: error
          }
        };
      }
      
      return { 
        data: result.result as T,
        debugInfo: {
          requestData: { module, action, data },
          responseData: result
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
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return { error: `No prompt found for module: ${module}` };
        }
        throw error;
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
      const { data: existingPrompt } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('module', prompt.module)
        .maybeSingle();
      
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
