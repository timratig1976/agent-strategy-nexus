
import { supabase } from "@/integrations/supabase/client";
import { AIServiceResponse, StrategyMetadata } from "./types";

export class RPCService {
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

  /**
   * Update the final status of agent results
   */
  static async updateAgentResultsFinalStatus(
    strategyId: string, 
    resultType: string
  ): Promise<AIServiceResponse<void>> {
    try {
      const { error } = await supabase.rpc(
        'update_agent_results_final_status',
        {
          strategy_id_param: strategyId,
          result_type_param: resultType
        }
      );
      
      if (error) {
        throw error;
      }
      
      return {
        data: undefined,
        debugInfo: {
          requestData: { strategyId, resultType }
        }
      };
    } catch (error) {
      console.error(`Error updating final status for ${resultType} results:`, error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while updating final status',
        debugInfo: {
          requestData: { strategyId, resultType },
          responseData: error
        }
      };
    }
  }
}
