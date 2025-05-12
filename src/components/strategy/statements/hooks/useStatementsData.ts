
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PainStatement, GainStatement } from '../types';
import { fetchStatements, saveStatementsToDatabase } from './statementsRepository';
import { mapToPainStatements, mapToGainStatements } from './statementsMapper';
import { StrategyState } from '@/types/marketing';
import { supabase } from '@/integrations/supabase/client';
import { stateToDbMap } from '@/utils/strategyUtils';

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
      
      // Save statements to database
      await saveStatementsToDatabase(strategyId, painStatements, gainStatements);
      
      // If it's the final version, update the strategy state
      if (isFinal) {
        // Map the StrategyState enum value to a valid database value using stateToDbMap
        const dbState = stateToDbMap[StrategyState.STATEMENTS];
        
        // Use type assertion to avoid TypeScript errors
        const { error: updateError } = await supabase
          .from('strategies')
          .update({ state: dbState })
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
