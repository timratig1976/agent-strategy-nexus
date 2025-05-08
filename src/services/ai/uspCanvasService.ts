
import { AIServiceResponse, UspCanvasAIResult } from "./types";
import { MarketingAIService } from "./marketingAIService";

export class UspCanvasService {
  /**
   * Generate USP Canvas Profile elements (Jobs, Pains, Gains)
   */
  static async generateUspCanvasProfile(
    strategyId: string,
    briefingContent: string,
    section?: 'jobs' | 'pains' | 'gains',
    enhancementText?: string,
    personaContent?: string
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    return MarketingAIService.generateContent<UspCanvasAIResult>(
      'usp_canvas_profile',
      'generate',
      {
        strategyId,
        briefingContent,
        section,
        enhancementText,
        personaContent
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
