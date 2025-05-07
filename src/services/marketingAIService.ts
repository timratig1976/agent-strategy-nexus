
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

// Add the missing StrategyMetadata interface
export interface StrategyMetadata {
  id: string;
  strategy_id: string;
  company_name: string | null;
  website_url: string | null;
  product_description: string | null;
  product_url: string | null;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
}

export class MarketingAIService {
  static async generateContent<T>(
    module: string, 
    action: 'generate' | 'edit', 
    data: any
  ): Promise<AIServiceResponse<T>> {
    try {
      console.log('Sending request to AI service:', { module, action, data });
      
      const response = await supabase.functions.invoke('marketing-ai', {
        body: { module, action, data }
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
  
  /**
   * Generate USP Canvas Profile elements (Jobs, Pains, Gains)
   */
  static async generateUspCanvasProfile(
    strategyId: string,
    briefingContent: string,
    section?: 'jobs' | 'pains' | 'gains',
    enhancementText?: string
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    return this.generateContent<UspCanvasAIResult>(
      'usp_canvas_profile',
      'generate',
      {
        strategyId,
        briefingContent,
        section,
        enhancementText
      }
    );
  }
  
  /**
   * Generate USP Canvas Value Map elements (Products, Pain Relievers, Gain Creators)
   */
  static async generateUspCanvasValueMap(
    strategyId: string,
    briefingContent: string,
    customerProfile: any,
    section?: 'products' | 'painRelievers' | 'gainCreators',
    enhancementText?: string
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    return this.generateContent<UspCanvasAIResult>(
      'usp_canvas_value_map',
      'generate',
      {
        strategyId,
        briefingContent,
        customerProfile,
        section,
        enhancementText
      }
    );
  }

  /**
   * Get strategy metadata using the properly typed RPC function
   */
  static async getStrategyMetadata(strategyId: string): Promise<AIServiceResponse<StrategyMetadata | null>> {
    try {
      const { data, error } = await supabase.rpc(
        'get_strategy_metadata',
        { strategy_id_param: strategyId }
      );
      
      if (error) {
        throw error;
      }
      
      return {
        data: data.length > 0 ? data[0] : null,
        debugInfo: {
          requestData: { strategyId },
          responseData: data
        }
      };
    } catch (error) {
      console.error(`Error fetching strategy metadata for strategy ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching strategy metadata',
        debugInfo: {
          requestData: { strategyId },
          responseData: error
        }
      };
    }
  }

  /**
   * Update strategy metadata using the properly typed RPC function
   */
  static async updateStrategyMetadata(
    strategyId: string,
    metadata: {
      companyName?: string | null;
      websiteUrl?: string | null;
      productDescription?: string | null;
      productUrl?: string | null;
      additionalInfo?: string | null;
    }
  ): Promise<AIServiceResponse<void>> {
    try {
      const { error } = await supabase.rpc(
        'upsert_strategy_metadata',
        {
          strategy_id_param: strategyId,
          company_name_param: metadata.companyName ?? null,
          website_url_param: metadata.websiteUrl ?? null,
          product_description_param: metadata.productDescription ?? null,
          product_url_param: metadata.productUrl ?? null,
          additional_info_param: metadata.additionalInfo ?? null
        }
      );
      
      if (error) {
        throw error;
      }
      
      return {
        data: undefined,
        debugInfo: {
          requestData: { strategyId, metadata }
        }
      };
    } catch (error) {
      console.error(`Error updating strategy metadata for strategy ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating strategy metadata',
        debugInfo: {
          requestData: { strategyId, metadata },
          responseData: error
        }
      };
    }
  }
}

// Types for USP Canvas AI generation
export interface UspCanvasAIResult {
  jobs?: UspCanvasJob[];
  pains?: UspCanvasPain[];
  gains?: UspCanvasGain[];
  products?: UspCanvasProduct[];
  painRelievers?: UspCanvasPainReliever[];
  gainCreators?: UspCanvasGainCreator[];
}

export interface UspCanvasJob {
  content: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UspCanvasPain {
  content: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UspCanvasGain {
  content: string;
  importance: 'low' | 'medium' | 'high';
}

export interface UspCanvasProduct {
  content: string;
  relatedJobIds?: string[];
}

export interface UspCanvasPainReliever {
  content: string;
  relatedPainIds?: string[];
}

export interface UspCanvasGainCreator {
  content: string;
  relatedGainIds?: string[];
}
