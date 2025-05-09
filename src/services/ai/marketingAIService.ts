
import { supabase } from "@/integrations/supabase/client";
import { AgentCoreService } from "./agentCoreService";
import { AIServiceResponse } from "./types";

// Define the class interface with proper static method declarations (Best Practice #2)
export interface MarketingAIServiceStatic {
  generateContent<T>(
    module: string,
    action: string,
    data: Record<string, any>,
    options?: { outputLanguage?: string }
  ): Promise<AIServiceResponse<T>>;
  
  // Added static method declarations that will be attached later
  getStrategyMetadata: Function;
  updateStrategyMetadata: Function;
  generateUspCanvasProfile: Function;
  generateUspCanvasValueMap: Function;
}

// Implement the MarketingAIService class with its core functionality
export class MarketingAIService implements MarketingAIServiceStatic {
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
    data: Record<string, any>,
    options?: { outputLanguage?: string }
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
          data,
          options
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

// Declare static methods properly using TypeScript's declaration merging (Best Practice #2)
// These properties will be assigned in marketingAIService.ts main file
