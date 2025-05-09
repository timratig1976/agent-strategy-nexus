import { MarketingAIService } from './marketingAIService';
import type { 
  AIServiceResponse, 
  UspCanvasAIResult,
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain,
} from './types';

// Create a new USP canvas profile with AI
export const generateUspCanvasProfile = async (
  data: {
    strategyId?: string;
    personas?: any[];
    briefingContent?: string;
    enhancementText?: string;
    outputLanguage?: string;
  }
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log("Generating USP Canvas Profile with data:", data);
    
    // Check required data
    if (!data.strategyId && !data.briefingContent) {
      return { 
        error: "Either strategyId or briefingContent is required" 
      };
    }
    
    const { data: responseData, error } = await MarketingAIService.generateContent(
      'usp_canvas',
      'generateProfile',
      data,
      { outputLanguage: data.outputLanguage }
    );
    
    if (error) {
      return { error, debugInfo: { originalError: error } };
    }
    
    return { 
      data: responseData as UspCanvasAIResult,
      debugInfo: { rawResponse: responseData }
    };
    
  } catch (error: any) {
    console.error("Error generating USP Canvas Profile:", error);
    return {
      error: `Failed to generate USP Canvas Profile: ${error.message || "Unknown error"}`,
      debugInfo: { error: error.toString() }
    };
  }
};

// Create a new value map with AI
export const generateUspCanvasValueMap = async (
  data: {
    strategyId?: string;
    companyName?: string;
    productDescription?: string;
    customerProfile?: {
      jobs?: UspCanvasJob[];
      pains?: UspCanvasPain[];
      gains?: UspCanvasGain[];
    };
    enhancementText?: string;
    outputLanguage?: string;
  }
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log("Generating USP Canvas Value Map with data:", data);
    
    // Check required data
    if (!data.strategyId && !data.customerProfile) {
      return { 
        error: "Either strategyId or customerProfile is required" 
      };
    }
    
    // If customer profile is provided, validate it has at least some data
    if (data.customerProfile) {
      const profile = data.customerProfile;
      if (
        (!profile.jobs || profile.jobs.length === 0) &&
        (!profile.pains || profile.pains.length === 0) &&
        (!profile.gains || profile.gains.length === 0)
      ) {
        return {
          error: "Customer profile must contain at least one job, pain, or gain"
        };
      }
    }
    
    const { data: responseData, error } = await MarketingAIService.generateContent(
      'usp_canvas',
      'generateValueMap',
      data,
      { outputLanguage: data.outputLanguage }
    );
    
    if (error) {
      return { error, debugInfo: { originalError: error } };
    }
    
    return { 
      data: responseData as UspCanvasAIResult,
      debugInfo: { rawResponse: responseData }
    };
    
  } catch (error: any) {
    console.error("Error generating USP Canvas Value Map:", error);
    return {
      error: `Failed to generate USP Canvas Value Map: ${error.message || "Unknown error"}`,
      debugInfo: { error: error.toString() }
    };
  }
};
