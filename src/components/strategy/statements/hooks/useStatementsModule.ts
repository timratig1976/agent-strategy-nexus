
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { StrategyState } from '@/types/marketing';
import { useStatementsData } from './useStatementsData';
import useStatementsGenerator from './useStatementsGenerator';
import useStrategyNavigation from '@/hooks/useStrategyNavigation';

interface UseStatementsModuleProps {
  strategyId: string;
}

export const useStatementsModule = ({ strategyId }: UseStatementsModuleProps) => {
  const [activeTab, setActiveTab] = useState<'pain' | 'gain'>('pain');
  const [editingStatementId, setEditingStatementId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use our hooks
  const {
    painStatements,
    gainStatements,
    addPainStatement,
    addGainStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    isLoading: isLoadingStatements,
    error: statementsError
  } = useStatementsData({ strategyId });
  
  const {
    generateStatements,
    isGenerating,
    progress,
    error: generationError,
    uspCanvasData,
    isLoadingCanvasData
  } = useStatementsGenerator(strategyId);

  const { navigateToNextStep, navigateToPreviousStep } = useStrategyNavigation({
    strategyId
  });

  // Handle statement generation
  const handleGenerateStatements = useCallback(async (prompt: string) => {
    try {
      return await generateStatements(prompt);
    } catch (error) {
      console.error('Error in generation:', error);
      return { painStatements: [], gainStatements: [] };
    }
  }, [generateStatements]);

  // Handle adding AI generated statements
  const handleAddGeneratedStatements = useCallback((generatedPainStatements: any[], generatedGainStatements: any[]) => {
    // Add all pain statements
    generatedPainStatements.forEach(statement => {
      addPainStatement(statement.content, statement.impact, true);
    });
    
    // Add all gain statements
    generatedGainStatements.forEach(statement => {
      addGainStatement(statement.content, statement.impact, true);
    });
  }, [addPainStatement, addGainStatement]);

  // Save statements and move to next step
  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements();
      toast.success('Statements saved successfully');
      navigateToNextStep(StrategyState.STATEMENTS);
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements, navigateToNextStep]);
  
  // Handle navigation back to previous step
  const handleNavigateBack = useCallback(() => {
    navigateToPreviousStep(StrategyState.STATEMENTS);
  }, [navigateToPreviousStep]);

  // Just save statements without navigation
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements();
      toast.success('Statements saved successfully');
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements]);

  // Handle adding new statement
  const handleAddStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high') => {
    if (activeTab === 'pain') {
      addPainStatement(content, impact);
    } else {
      addGainStatement(content, impact);
    }
  }, [activeTab, addPainStatement, addGainStatement]);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    editingStatementId,
    setEditingStatementId,
    painStatements,
    gainStatements,
    statementsError,
    generationError,
    isLoadingStatements,
    isGenerating,
    progress,
    uspCanvasData,
    isLoadingCanvasData,
    handleGenerateStatements,
    handleAddGeneratedStatements,
    handleSaveAndContinue,
    handleNavigateBack,
    handleSave,
    handleAddStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
  };
};

export default useStatementsModule;
