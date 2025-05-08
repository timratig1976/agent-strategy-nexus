
import { supabase } from "@/integrations/supabase/client";
import { AIServiceResponse, UspCanvasAIResult } from "./types";
import { MarketingAIService } from "./marketingAIService";

export class UspCanvasService {
  /**
   * Generate USP Canvas Profile elements (Jobs, Pains, Gains)
   */
  static async generateUspCanvasProfile(
    strategyId: string,
    briefingContent: string,
    section?: 'jobs' | 'pains' | 'gains' | 'all',
    enhancementText?: string,
    personaContent?: string
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    console.log('UspCanvasService.generateUspCanvasProfile called with:', {
      strategyId,
      section,
      briefingContentLength: briefingContent?.length || 0,
      personaContentLength: personaContent?.length || 0,
      enhancementText: enhancementText ? 'provided' : 'not provided'
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('marketing-ai', {
        body: { 
          module: 'usp_canvas_profile', 
          action: 'generate', 
          data: {
            strategyId,
            briefingContent,
            section,
            enhancementText,
            personaContent
          }
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate USP Canvas profile');
      }
      
      console.log('USP Canvas profile generation result:', data);
      
      return {
        data: data.result as UspCanvasAIResult,
        debugInfo: {
          requestData: { 
            strategyId,
            briefingContentLength: briefingContent?.length || 0,
            personaContentLength: personaContent?.length || 0,
            section,
            enhancementText 
          },
          responseData: data
        }
      };
    } catch (error) {
      console.error('Error in UspCanvasService.generateUspCanvasProfile:', error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating USP Canvas profile',
        debugInfo: {
          requestData: { 
            strategyId,
            briefingContentLength: briefingContent?.length || 0,
            personaContentLength: personaContent?.length || 0,
            section,
            enhancementText 
          },
          responseData: error
        }
      };
    }
  }
  
  /**
   * Generate USP Canvas Value Map elements (Products, Pain Relievers, Gain Creators)
   */
  static async generateUspCanvasValueMap(
    strategyId: string,
    briefingContent: string,
    customerProfile: any,
    section?: 'products' | 'painRelievers' | 'gainCreators' | 'all',
    enhancementText?: string,
    personaContent?: string
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    return MarketingAIService.generateContent<UspCanvasAIResult>(
      'usp_canvas_value_map',
      'generate',
      {
        strategyId,
        briefingContent,
        customerProfile,
        section,
        enhancementText,
        personaContent
      }
    );
  }
}
