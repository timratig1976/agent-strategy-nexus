
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
      console.log('Invoking Supabase function: marketing-ai');
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('marketing-ai', {
        body: { 
          module: 'usp_canvas_profile', 
          action: 'generate', 
          data: {
            strategyId,
            briefingContent,
            section: section || 'all',
            enhancementText,
            personaContent
          }
        }
      });
      
      const endTime = Date.now();
      console.log(`Supabase function response received in ${endTime - startTime}ms`);
      
      if (error) {
        console.error('Supabase function error:', error);
        return {
          error: error.message || 'Failed to generate USP Canvas profile',
          debugInfo: {
            requestData: { 
              strategyId,
              briefingContentLength: briefingContent?.length || 0,
              personaContentLength: personaContent?.length || 0,
              section,
              enhancementText 
            },
            responseData: { errorDetails: error }
          }
        };
      }
      
      if (!data || !data.result) {
        console.error('Invalid response format from marketing-ai function:', data);
        return {
          error: 'Invalid response from AI service',
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
      }
      
      console.log('USP Canvas profile generation result:', data.result);
      
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
          responseData: {
            result: data,
            timeTaken: `${endTime - startTime}ms`,
            timestamp: new Date().toISOString()
          }
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
          responseData: { errorMessage: String(error) }
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
