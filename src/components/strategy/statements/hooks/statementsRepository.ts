
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { StrategyStatementRow } from './types';
import { PainStatement, GainStatement } from '../types';

/**
 * Load statements from the database for a specific strategy
 */
export const fetchStatements = async (strategyId: string): Promise<StrategyStatementRow[]> => {
  try {
    // Use raw query to avoid type errors with supabase client
    const { data, error } = await supabase
      .from('strategy_statements')
      .select('*')
      .eq('strategy_id', strategyId) as any; // Use 'any' to bypass TypeScript checking 
    
    if (error) {
      console.error('Error loading statements:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in fetchStatements:', err);
    throw err;
  }
};

/**
 * Save statements to the database
 */
export const saveStatementsToDatabase = async (
  strategyId: string,
  painStatements: PainStatement[],
  gainStatements: GainStatement[]
): Promise<void> => {
  try {
    // Prepare statements for saving
    const statementsToSave = [
      ...painStatements.map(statement => ({
        id: statement.id,
        strategy_id: strategyId,
        content: statement.content,
        impact: statement.impact,
        is_ai_generated: statement.isAiGenerated || false,
        statement_type: 'pain',
        created_at: statement.createdAt || new Date().toISOString()
      })),
      ...gainStatements.map(statement => ({
        id: statement.id,
        strategy_id: strategyId,
        content: statement.content,
        impact: statement.impact,
        is_ai_generated: statement.isAiGenerated || false,
        statement_type: 'gain',
        created_at: statement.createdAt || new Date().toISOString()
      }))
    ];

    // Delete existing statements for this strategy using raw query
    const { error: deleteError } = await supabase
      .from('strategy_statements')
      .delete()
      .eq('strategy_id', strategyId) as any; // Use 'any' to bypass TypeScript checking

    if (deleteError) {
      throw new Error(`Failed to delete existing statements: ${deleteError.message}`);
    }

    // Insert new statements if we have any using raw query
    if (statementsToSave.length > 0) {
      const { error: insertError } = await supabase
        .from('strategy_statements')
        .insert(statementsToSave) as any; // Use 'any' to bypass TypeScript checking

      if (insertError) {
        throw new Error(`Failed to save statements: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in saveStatementsToDatabase:', error);
    throw error;
  }
};
