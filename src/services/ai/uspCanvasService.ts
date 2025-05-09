
import { supabase } from "@/integrations/supabase/client";
import { AIServiceResponse, FormatOptions, OutputLanguage, UspCanvasAIResult } from "./types";

/**
 * Generate a user profile for the USP Canvas based on briefing
 * @param strategyId Strategy ID
 * @param briefingContent Content of the briefing
 * @param profileType Type of profile to generate ('jobs', 'pains', 'gains', or 'all')
 * @param enhancementText Additional instructions
 * @param personaContent Optional persona content to include
 * @param formatOptions Optional formatting options like output language
 * @returns Generated customer profile
 */
export const generateUspCanvasProfile = async (
  strategyId: string,
  briefingContent: string,
  profileType: 'jobs' | 'pains' | 'gains' | 'all',
  enhancementText?: string,
  personaContent?: string,
  formatOptions?: FormatOptions
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log(`Generating USP Canvas profile for strategy ${strategyId}, type: ${profileType}`);
    console.log(`Briefing content length: ${briefingContent?.length || 0}`);
    console.log(`Persona content included: ${!!personaContent}`);

    // Get the strategy language if no format option is provided
    let outputLanguage: OutputLanguage = formatOptions?.outputLanguage || 'english';
    
    if (!formatOptions?.outputLanguage) {
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('language')
          .eq('id', strategyId)
          .single();
        
        if (!error && data?.language) {
          // Make sure the language is a valid OutputLanguage
          outputLanguage = data.language === 'deutsch' ? 'deutsch' : 'english';
        }
      } catch (err) {
        console.error("Error fetching strategy language:", err);
      }
    }
    
    // Call the edge function to generate content
    const { data, error } = await supabase.functions.invoke('usp-canvas-ai', {
      body: {
        action: 'generate_profile',
        strategyId,
        briefingContent,
        profileType,
        enhancementText,
        personaContent,
        outputLanguage
      }
    });

    if (error) {
      console.error(`Edge function error for USP Canvas profile:`, error);
      return {
        error: `Edge function error: ${error.message || JSON.stringify(error)}`,
        debugInfo: { error }
      };
    }

    if (data.error) {
      console.error(`AI Service error for USP Canvas profile:`, data.error);
      return {
        error: data.error,
        debugInfo: data.debugInfo
      };
    }

    console.log(`Successfully generated USP Canvas profile`);
    return {
      data: data.result,
      debugInfo: data.debugInfo
    };
  } catch (error: any) {
    console.error(`Error in generateUspCanvasProfile:`, error);
    return {
      error: `Service error: ${error.message || "Unknown error"}`,
      debugInfo: { error: error.toString() }
    };
  }
}

/**
 * Generate value proposition elements for the USP Canvas based on customer profile
 * @param strategyId Strategy ID
 * @param briefingContent Content of the briefing
 * @param customerProfileContent Content of the customer profile
 * @param valueType Type of value to generate ('products', 'painRelievers', 'gainCreators', or 'all')
 * @param enhancementText Additional instructions
 * @param formatOptions Optional formatting options like output language
 * @returns Generated value proposition elements
 */
export const generateUspCanvasValueProposition = async (
  strategyId: string,
  briefingContent: string,
  customerProfileContent: string,
  valueType: 'products' | 'painRelievers' | 'gainCreators' | 'all',
  enhancementText?: string,
  formatOptions?: FormatOptions
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log(`Generating USP Canvas value proposition for strategy ${strategyId}, type: ${valueType}`);

    // Get the strategy language if no format option is provided
    let outputLanguage: OutputLanguage = formatOptions?.outputLanguage || 'english';
    
    if (!formatOptions?.outputLanguage) {
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('language')
          .eq('id', strategyId)
          .single();
        
        if (!error && data?.language) {
          // Make sure the language is a valid OutputLanguage
          outputLanguage = data.language === 'deutsch' ? 'deutsch' : 'english';
        }
      } catch (err) {
        console.error("Error fetching strategy language:", err);
      }
    }
    
    // Call the edge function to generate content
    const { data, error } = await supabase.functions.invoke('usp-canvas-ai', {
      body: {
        action: 'generate_value_proposition',
        strategyId,
        briefingContent,
        customerProfileContent,
        valueType,
        enhancementText,
        outputLanguage
      }
    });

    if (error) {
      console.error(`Edge function error for USP Canvas value proposition:`, error);
      return {
        error: `Edge function error: ${error.message || JSON.stringify(error)}`,
        debugInfo: { error }
      };
    }

    if (data.error) {
      console.error(`AI Service error for USP Canvas value proposition:`, data.error);
      return {
        error: data.error,
        debugInfo: data.debugInfo
      };
    }

    console.log(`Successfully generated USP Canvas value proposition`);
    return {
      data: data.result,
      debugInfo: data.debugInfo
    };
  } catch (error: any) {
    console.error(`Error in generateUspCanvasValueProposition:`, error);
    return {
      error: `Service error: ${error.message || "Unknown error"}`,
      debugInfo: { error: error.toString() }
    };
  }
}
