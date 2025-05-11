
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { PainStatement, GainStatement } from '../types';
import { UseStatementsDataProps, UseStatementsDataReturn } from './types';
import { fetchStatements, saveStatementsToDatabase } from './statementsRepository';
import { mapToPainStatements, mapToGainStatements } from './statementsMapper';

export const useStatementsData = ({ strategyId }: UseStatementsDataProps): UseStatementsDataReturn => {
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
      
      const statements = await fetchStatements(strategyId);
      
      if (statements.length > 0) {
        setPainStatements(mapToPainStatements(statements));
        setGainStatements(mapToGainStatements(statements));
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
      
      await saveStatementsToDatabase(strategyId, painStatements, gainStatements);
      
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
