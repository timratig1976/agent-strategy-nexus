
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PainStatement, GainStatement } from '../types';

interface UseStatementsDataProps {
  strategyId?: string;
}

// Define a TypeScript interface for the strategy_statements table row
interface StrategyStatementRow {
  id: string;
  strategy_id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
  statement_type: 'pain' | 'gain';
  created_at: string;
}

export const useStatementsData = ({ strategyId }: UseStatementsDataProps) => {
  const [painStatements, setPainStatements] = useState<PainStatement[]>([]);
  const [gainStatements, setGainStatements] = useState<GainStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load statements from database
  const loadStatements = useCallback(async () => {
    if (!strategyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Cast to any to bypass TypeScript's type checking since the table might not be in types yet
      const { data, error } = await (supabase as any)
        .from('strategy_statements')
        .select('*')
        .eq('strategy_id', strategyId);
      
      if (error) {
        console.error('Error loading statements:', error);
        toast.error('Failed to load statements');
        return;
      }

      if (data && data.length > 0) {
        // Process the data properly with type assertions
        const statements = data as StrategyStatementRow[];
        
        // Format data from database
        const painStatements = statements
          .filter(item => item.statement_type === 'pain')
          .map(item => ({
            id: item.id,
            content: item.content,
            impact: item.impact,
            isAIGenerated: item.is_ai_generated,
            createdAt: item.created_at
          })) as PainStatement[];
        
        const gainStatements = statements
          .filter(item => item.statement_type === 'gain')
          .map(item => ({
            id: item.id,
            content: item.content,
            impact: item.impact,
            isAIGenerated: item.is_ai_generated,
            createdAt: item.created_at
          })) as GainStatement[];
          
        setPainStatements(painStatements);
        setGainStatements(gainStatements);
      }
    } catch (error) {
      console.error('Error in loadStatements:', error);
      toast.error('Failed to load statements');
    } finally {
      setIsLoading(false);
    }
  }, [strategyId]);

  useEffect(() => {
    loadStatements();
  }, [loadStatements]);

  // Add pain statement
  const addPainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newStatement: PainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAIGenerated,
      createdAt: new Date().toISOString()
    };
    
    setPainStatements(prev => [...prev, newStatement]);
    setHasChanges(true);
  }, []);

  // Add gain statement
  const addGainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newStatement: GainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAIGenerated,
      createdAt: new Date().toISOString()
    };
    
    setGainStatements(prev => [...prev, newStatement]);
    setHasChanges(true);
  }, []);

  // Delete pain statement
  const deletePainStatement = useCallback((id: string) => {
    setPainStatements(prev => prev.filter(statement => statement.id !== id));
    setHasChanges(true);
  }, []);

  // Delete gain statement
  const deleteGainStatement = useCallback((id: string) => {
    setGainStatements(prev => prev.filter(statement => statement.id !== id));
    setHasChanges(true);
  }, []);

  // Update pain statement
  const updatePainStatement = useCallback((id: string, content: string, impact: 'low' | 'medium' | 'high') => {
    setPainStatements(prev => 
      prev.map(statement => 
        statement.id === id 
          ? { ...statement, content, impact } 
          : statement
      )
    );
    setHasChanges(true);
  }, []);

  // Update gain statement
  const updateGainStatement = useCallback((id: string, content: string, impact: 'low' | 'medium' | 'high') => {
    setGainStatements(prev => 
      prev.map(statement => 
        statement.id === id 
          ? { ...statement, content, impact } 
          : statement
      )
    );
    setHasChanges(true);
  }, []);

  // Save statements to the database
  const saveStatements = useCallback(async () => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare statements for saving
      const statementsToSave = [
        ...painStatements.map(statement => ({
          id: statement.id,
          strategy_id: strategyId,
          content: statement.content,
          impact: statement.impact,
          is_ai_generated: statement.isAIGenerated || false,
          statement_type: 'pain',
          created_at: statement.createdAt
        })),
        ...gainStatements.map(statement => ({
          id: statement.id,
          strategy_id: strategyId,
          content: statement.content,
          impact: statement.impact,
          is_ai_generated: statement.isAIGenerated || false,
          statement_type: 'gain',
          created_at: statement.createdAt
        }))
      ];

      // Delete existing statements for this strategy using type assertion 
      // to bypass TypeScript's type checking
      const { error: deleteError } = await (supabase as any)
        .from('strategy_statements')
        .delete()
        .eq('strategy_id', strategyId);

      if (deleteError) {
        throw new Error(`Failed to delete existing statements: ${deleteError.message}`);
      }

      // Insert new statements if we have any
      if (statementsToSave.length > 0) {
        const { error: insertError } = await (supabase as any)
          .from('strategy_statements')
          .insert(statementsToSave);

        if (insertError) {
          throw new Error(`Failed to save statements: ${insertError.message}`);
        }
      }

      toast.success('Statements saved successfully');
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error saving statements:', error);
      toast.error(error.message || 'Failed to save statements');
    } finally {
      setIsSaving(false);
    }
  }, [strategyId, painStatements, gainStatements]);

  return {
    painStatements,
    gainStatements,
    addPainStatement,
    addGainStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    isLoading,
    isSaving,
    hasChanges,
    loadStatements
  };
};
