
import { corsHeaders } from "@/constants";
import { supabase } from "@/integrations/supabase/client";
import { AgentCoreService } from "./agentCoreService";

export interface AIServiceResponse<T = any> {
  data?: T;
  error?: string;
  debugInfo?: any;
}

export class MarketingAIService {
  /**
   * Generate content using AI with robust error handling and fallbacks
   * @param module The module name
   * @param action The action to perform
   * @param data Input data for the generation
   * @returns Service response with data or error
   */
  static async generateContent<T = any>(
    module: string,
    action: string,
    data: Record<string, any>
  ): Promise<AIServiceResponse<T>> {
    try {
      console.log(`Generating content for ${module}/${action} with data:`, data);
      
      // Check if the module has prompts, if not, try to create them
      const hasPrompts = await AgentCoreService.ensurePromptsExist(module);
      if (!hasPrompts) {
        console.log(`Warning: No prompts available for module ${module}. Using defaults if available.`);
      }

      // Call the function to generate content
      const { data: responseData, error } = await supabase.functions.invoke("marketing-ai", {
        body: {
          module,
          action,
          data
        }
      });

      if (error) {
        console.error(`Edge function error for ${module}/${action}:`, error);
        return {
          error: `Edge function error: ${error.message || JSON.stringify(error)}`,
          debugInfo: { error }
        };
      }

      console.log(`Response for ${module}/${action}:`, responseData);
      
      if (responseData.error) {
        return {
          error: responseData.error,
          debugInfo: responseData.debugInfo
        };
      }

      return {
        data: responseData.result as T,
        debugInfo: responseData.debugInfo
      };
    } catch (error: any) {
      console.error(`Error in generateContent(${module}/${action}):`, error);
      return {
        error: `Service error: ${error.message || "Unknown error"}`,
        debugInfo: { error: error.toString() }
      };
    }
  }
}
