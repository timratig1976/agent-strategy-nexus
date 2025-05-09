
import { MarketingAIService } from './marketingAIService';
import type { 
  AIServiceResponse, 
  UspCanvasAIResult,
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain,
} from './types';

/**
 * Service for generating USP Canvas content using AI
 */
export const generateUspCanvasProfile = async (
  strategyId: string,
  briefingContent: string,
  contentType: 'all' | 'jobs' | 'pains' | 'gains' = 'all',
  enhancementText: string = '',
  personaContent: string = '',
  options: { outputLanguage?: string } = {}
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log("Generating USP Canvas Profile with data:", { 
      strategyId, 
      briefingContent: briefingContent?.length || 0,
      contentType,
      enhancementText,
      personaContent: personaContent?.length || 0
    });
    
    // Check required data
    if (!strategyId && !briefingContent) {
      return { 
        error: "Either strategyId or briefingContent is required" 
      };
    }
    
    const data = {
      strategyId,
      briefingContent,
      contentType,
      enhancementText,
      personaContent,
      outputLanguage: options.outputLanguage
    };
    
    const { data: responseData, error, debugInfo } = await MarketingAIService.generateContent(
      'usp_canvas',
      'generateProfile',
      data,
      { outputLanguage: options.outputLanguage }
    );
    
    if (error) {
      return { 
        error, 
        debugInfo: { 
          requestData: data,
          responseData: debugInfo
        } 
      };
    }
    
    return { 
      data: responseData as UspCanvasAIResult,
      debugInfo: { 
        requestData: data,
        responseData: debugInfo
      }
    };
    
  } catch (error: any) {
    console.error("Error generating USP Canvas Profile:", error);
    return {
      error: `Failed to generate USP Canvas Profile: ${error.message || "Unknown error"}`,
      debugInfo: { 
        requestData: {
          strategyId,
          briefingContent: briefingContent?.length || 0,
          contentType,
          enhancementText,
          personaContent: personaContent?.length || 0
        },
        responseData: null
      }
    };
  }
};

// Create a new value map with AI
export const generateUspCanvasValueMap = async (
  strategyId: string,
  companyName: string = '',
  productDescription: string = '',
  customerProfile: {
    jobs?: UspCanvasJob[];
    pains?: UspCanvasPain[];
    gains?: UspCanvasGain[];
  } = {},
  enhancementText: string = '',
  options: { outputLanguage?: string } = {}
): Promise<AIServiceResponse<UspCanvasAIResult>> => {
  try {
    console.log("Generating USP Canvas Value Map with data:", { 
      strategyId, 
      companyName,
      customerProfile
    });
    
    // Check required data
    if (!strategyId && !customerProfile) {
      return { 
        error: "Either strategyId or customerProfile is required" 
      };
    }
    
    // If customer profile is provided, validate it has at least some data
    if (customerProfile) {
      const profile = customerProfile;
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
    
    const data = {
      strategyId,
      companyName,
      productDescription,
      customerProfile,
      enhancementText,
      outputLanguage: options.outputLanguage
    };
    
    const { data: responseData, error, debugInfo } = await MarketingAIService.generateContent(
      'usp_canvas',
      'generateValueMap',
      data,
      { outputLanguage: options.outputLanguage }
    );
    
    if (error) {
      return { 
        error, 
        debugInfo: { 
          requestData: data,
          responseData: debugInfo
        } 
      };
    }
    
    return { 
      data: responseData as UspCanvasAIResult,
      debugInfo: { 
        requestData: data,
        responseData: debugInfo
      }
    };
    
  } catch (error: any) {
    console.error("Error generating USP Canvas Value Map:", error);
    return {
      error: `Failed to generate USP Canvas Value Map: ${error.message || "Unknown error"}`,
      debugInfo: { 
        requestData: {
          strategyId,
          companyName,
          customerProfile: {
            jobCount: customerProfile.jobs?.length || 0,
            painCount: customerProfile.pains?.length || 0,
            gainCount: customerProfile.gains?.length || 0
          }
        },
        responseData: null
      }
    };
  }
};

// Export the functions as an object to allow direct importing
export const UspCanvasService = {
  generateUspCanvasProfile,
  generateUspCanvasValueMap
};
