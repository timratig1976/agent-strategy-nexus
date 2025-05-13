
import { StatementsService } from '@/services/ai/statementsService';

export interface StatementsGenerationOptions {
  strategyId: string;
}

export interface GeneratedStatements {
  painStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  gainStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  rawOutput?: string;
  error?: string;
  debugInfo?: any;
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
      // Call the statements service to generate statements
      const result = await StatementsService.generateStatements({
        strategyId,
        uspData
      });
      
      return {
        painStatements: result?.data?.painStatements || [],
        gainStatements: result?.data?.gainStatements || [],
        rawOutput: result?.rawOutput,
        debugInfo: result?.debugInfo
      };
    } catch (error: any) {
      console.error('Error in statements generation service:', error);
      return {
        painStatements: [],
        gainStatements: [],
        error: error.message || 'An error occurred while generating statements'
      };
    }
  }
}
