
import { supabase } from "@/integrations/supabase/client";
import { AIServiceResponse, StrategyMetadata } from "./types";

export class RPCService {
  /**
   * Gets strategy metadata from the database using an RPC function
   */
  static async getStrategyMetadata(
    strategyId: string
  ): Promise<AIServiceResponse<StrategyMetadata>> {
    try {
      const { data, error } = await supabase.rpc('get_strategy_metadata', {
        strategy_id_param: strategyId
      });
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return { 
          error: `No metadata found for strategy ID: ${strategyId}` 
        };
      }
      
      return { data: data[0] as StrategyMetadata };
    } catch (error) {
      console.error(`Error fetching strategy metadata for ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching strategy metadata' 
      };
    }
  }

  /**
   * Updates strategy metadata in the database using an RPC function
   */
  static async updateStrategyMetadata(
    strategyId: string,
    metadata: Partial<StrategyMetadata>
  ): Promise<AIServiceResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('upsert_strategy_metadata', {
        strategy_id_param: strategyId,
        company_name_param: metadata.company_name || null,
        website_url_param: metadata.website_url || null,
        product_description_param: metadata.product_description || null,
        product_url_param: metadata.product_url || null,
        additional_info_param: metadata.additional_info || null
      });
      
      if (error) {
        throw error;
      }
      
      return { data: true };
    } catch (error) {
      console.error(`Error updating strategy metadata for ID ${strategyId}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating strategy metadata' 
      };
    }
  }

  /**
   * Updates an AI prompt in the database or creates it if it doesn't exist
   */
  static async updateOrCreatePrompt(
    module: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIServiceResponse<boolean>> {
    try {
      console.log(`Updating prompt for module: ${module}`);
      
      // Check if prompt exists
      const { data: existingPrompt, error: fetchError } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('module', module)
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
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPrompt.id);
      } else {
        // Insert new prompt
        result = await supabase
          .from('ai_prompts')
          .insert({
            module,
            system_prompt: systemPrompt,
            user_prompt: userPrompt
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      console.log(`Successfully updated prompt for module: ${module}`);
      return { data: true };
    } catch (error) {
      console.error(`Error updating AI prompt for module ${module}:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating the prompt'
      };
    }
  }
}

