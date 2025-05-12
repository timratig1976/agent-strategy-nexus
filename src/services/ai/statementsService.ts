
import { supabase } from "@/integrations/supabase/client";

interface StatementsGenerationOptions {
  strategyId: string;
  uspData?: any;
  customPrompt?: string;
  outputLanguage?: string;
  minStatements?: number;
}

export interface GeneratedStatements {
  painStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  gainStatements: Array<{ content: string; impact: 'low' | 'medium' | 'high' }>;
  rawOutput?: string;
}

export class StatementsService {
  /**
   * Generate statements using the edge function
   */
  static async generateStatements(options: StatementsGenerationOptions): Promise<GeneratedStatements> {
    const { strategyId, uspData, customPrompt, outputLanguage = 'english', minStatements = 10 } = options;
    
    if (!strategyId) {
      throw new Error('Strategy ID is required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('statements-generator', {
        body: { 
          strategyId, 
          uspData,
          customPrompt,
          outputLanguage,
          minStatements
        },
      });

      if (error) {
        console.error('Error invoking statements-generator function:', error);
        throw new Error(`Failed to generate statements: ${error.message}`);
      }

      if (!data || !data.result) {
        throw new Error('No result returned from statements generator');
      }

      return {
        painStatements: data.result.painStatements || [],
        gainStatements: data.result.gainStatements || [],
        rawOutput: data.result.rawOutput
      };
    } catch (error: any) {
      console.error('Statements generation service error:', error);
      throw new Error(`Failed to generate statements: ${error.message}`);
    }
  }
}
