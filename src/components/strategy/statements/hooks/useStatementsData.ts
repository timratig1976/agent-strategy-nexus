
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { PainStatement, GainStatement } from '../types';
import { fetchStatements } from './statementsRepository';
import { mapToPainStatements, mapToGainStatements } from './statementsMapper';

interface UseStatementsDataProps {
  strategyId: string;
  onChanges?: (hasChanges: boolean) => void;
}

export const useStatementsData = ({ strategyId, onChanges }: UseStatementsDataProps) => {
  const [painStatements, setPainStatements] = useState<PainStatement[]>([]);
  const [gainStatements, setGainStatements] = useState<GainStatement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false);

  // Notify parent component about changes
  useEffect(() => {
    if (onChanges) {
      onChanges(hasLocalChanges);
    }
  }, [hasLocalChanges, onChanges]);

  // Load statements from database
  const fetchStatementsData = useCallback(async () => {
    if (!strategyId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all statements for the strategy
      const rows = await fetchStatements(strategyId);
      
      // Process the results into pain and gain statements
      const painResults = mapToPainStatements(rows);
      const gainResults = mapToGainStatements(rows);
      
      setPainStatements(painResults);
      setGainStatements(gainResults);
      setHasLocalChanges(false);
    } catch (err) {
      console.error('Error loading statements:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading statements'));
    } finally {
      setIsLoading(false);
    }
  }, [strategyId]);

  // Load statements on mount
  useEffect(() => {
    fetchStatementsData();
  }, [fetchStatementsData]);

  // Add a new pain statement
  const addPainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high' = 'medium', isAiGenerated: boolean = false) => {
    const newStatement: PainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAiGenerated,
      createdAt: new Date().toISOString(),
    };
    
    setPainStatements(prev => [...prev, newStatement]);
    setHasLocalChanges(true);
  }, []);

  // Add a new gain statement
  const addGainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high' = 'medium', isAiGenerated: boolean = false) => {
    const newStatement: GainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAiGenerated,
      createdAt: new Date().toISOString(),
    };
    
    setGainStatements(prev => [...prev, newStatement]);
    setHasLocalChanges(true);
  }, []);

  // Update a pain statement
  const updatePainStatement = useCallback((id: string, updates: Partial<PainStatement>) => {
    setPainStatements(prev => prev.map(statement => 
      statement.id === id ? { ...statement, ...updates } : statement
    ));
    setHasLocalChanges(true);
  }, []);

  // Update a gain statement
  const updateGainStatement = useCallback((id: string, updates: Partial<GainStatement>) => {
    setGainStatements(prev => prev.map(statement => 
      statement.id === id ? { ...statement, ...updates } : statement
    ));
    setHasLocalChanges(true);
  }, []);

  // Delete a pain statement
  const deletePainStatement = useCallback((id: string) => {
    setPainStatements(prev => prev.filter(statement => statement.id !== id));
    setHasLocalChanges(true);
  }, []);

  // Delete a gain statement
  const deleteGainStatement = useCallback((id: string) => {
    setGainStatements(prev => prev.filter(statement => statement.id !== id));
    setHasLocalChanges(true);
  }, []);

  // Save statements to database
  const saveStatements = useCallback(async (isFinal: boolean = false) => {
    if (!strategyId) return false;

    try {
      setIsLoading(true);
      
      // Delete all existing statements for this strategy
      const { error: deleteError } = await supabase
        .from('strategy_statements')
        .delete()
        .eq('strategy_id', strategyId);
      
      if (deleteError) {
        throw new Error(`Error deleting existing statements: ${deleteError.message}`);
      }
      
      // Prepare statements for insertion
      const statementsToInsert = [
        ...painStatements.map(statement => ({
          strategy_id: strategyId,
          content: statement.content,
          impact: statement.impact,
          statement_type: 'pain',
          is_ai_generated: statement.isAiGenerated,
          created_at: statement.createdAt || new Date().toISOString(),
        })),
        ...gainStatements.map(statement => ({
          strategy_id: strategyId,
          content: statement.content,
          impact: statement.impact,
          statement_type: 'gain',
          is_ai_generated: statement.isAiGenerated,
          created_at: statement.createdAt || new Date().toISOString(),
        }))
      ];
      
      if (statementsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('strategy_statements')
          .insert(statementsToInsert);
        
        if (insertError) {
          throw new Error(`Error inserting statements: ${insertError.message}`);
        }
      }
      
      // If it's the final version, update the strategy state
      if (isFinal) {
        const { error: updateError } = await supabase
          .from('strategies')
          .update({ state: 'statements' }) // Mark as having completed the statements phase
          .eq('id', strategyId);
          
        if (updateError) {
          throw new Error(`Error updating strategy state: ${updateError.message}`);
        }
      }
      
      setHasLocalChanges(false);
      return true;
    } catch (err) {
      console.error('Error saving statements:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [strategyId, painStatements, gainStatements]);

  return {
    painStatements,
    gainStatements,
    isLoading,
    error,
    fetchStatements: fetchStatementsData,
    addPainStatement,
    addGainStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    hasLocalChanges,
    setHasLocalChanges
  };
};
