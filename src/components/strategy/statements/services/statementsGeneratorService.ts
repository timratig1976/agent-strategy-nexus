
import { StatementsService, GeneratedStatements } from '@/services/ai/statementsService';

export interface StatementsGenerationOptions {
  strategyId: string;
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
      return await StatementsService.generateStatements({
        strategyId,
        uspData
      });
    } catch (error: any) {
      console.error('Error in statements generation service:', error);
      throw error;
    }
  }
}
