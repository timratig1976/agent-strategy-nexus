
import { MarketingAIService } from '@/services/marketingAIService';

export interface StatementsGenerationOptions {
  strategyId: string;
}

export interface GeneratedStatements {
  painStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  gainStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  rawOutput?: string;
}

/**
 * Service for generating pain and gain statements using AI
 */
export class StatementsGeneratorService {
  /**
   * Generate statements from USP Canvas data
   */
  static async generateStatements(
    strategyId: string,
    uspData: any
  ): Promise<GeneratedStatements> {
    if (!strategyId) {
      throw new Error('Strategy ID is required');
    }

    try {
      // Call the marketing AI service to generate statements
      const response = await MarketingAIService.generateContent('statements', 'generate', {
        strategyId,
        uspData
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const result = response.data?.rawOutput || '';
      
      return {
        painStatements: [],
        gainStatements: [],
        rawOutput: result
      };
    } catch (error: any) {
      console.error('Error in statements generation service:', error);
      throw error;
    }
  }
}
