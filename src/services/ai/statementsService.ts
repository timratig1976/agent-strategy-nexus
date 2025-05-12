
import { supabase } from '@/integrations/supabase/client';

export interface StatementsGenerationOptions {
  strategyId: string;
  uspData: any;
  outputLanguage?: string;
}

export interface GeneratedStatements {
  painStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  gainStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  rawOutput?: string;
}

export class StatementsService {
  /**
   * Generate statements from USP Canvas data
   */
  static async generateStatements(
    options: StatementsGenerationOptions
  ): Promise<GeneratedStatements> {
    const { strategyId, uspData, outputLanguage = 'english' } = options;

    if (!strategyId) {
      throw new Error('Strategy ID is required');
    }

    if (!uspData) {
      throw new Error('USP Canvas data is required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('statements-generator', {
        body: {
          strategyId,
          uspData,
          outputLanguage
        }
      });

      if (error) {
        throw new Error(`Error invoking statements generator: ${error.message}`);
      }

      if (!data || !data.result) {
        throw new Error('Invalid response from statements generator');
      }

      return {
        painStatements: data.result.painStatements || [],
        gainStatements: data.result.gainStatements || [],
        rawOutput: data.result.rawOutput
      };
    } catch (error: any) {
      console.error('Error in statements generation service:', error);
      throw error;
    }
  }
}
