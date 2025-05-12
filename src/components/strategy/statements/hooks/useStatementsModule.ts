
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { StrategyState } from '@/types/marketing';
import { useStatementsData } from './useStatementsData';
import useStatementsGenerator from './useStatementsGenerator';
import useStrategyNavigation from '@/hooks/useStrategyNavigation';
import { useAgentPrompt } from '@/hooks/useAgentPrompt';
import { supabase } from '@/integrations/supabase/client';

interface UseStatementsModuleProps {
  strategyId: string;
}

export const useStatementsModule = ({ strategyId }: UseStatementsModuleProps) => {
  const [activeTab, setActiveTab] = useState<'pain' | 'gain'>('pain');
  const [editingStatementId, setEditingStatementId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  // Load custom prompt from settings
  const { userPrompt, systemPrompt } = useAgentPrompt('statements');
  
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
    error: statementsError,
    setHasLocalChanges
  } = useStatementsData({ 
    strategyId,
    onChanges: (hasChanged) => setHasChanges(hasChanged)
  });
  
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

  // Load strategy language for AI
  const [outputLanguage, setOutputLanguage] = useState<string>('english');
  
  useEffect(() => {
    const loadStrategyLanguage = async () => {
      if (!strategyId) return;
      
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('language')
          .eq('id', strategyId)
          .single();
        
        if (error) {
          console.error('Error loading strategy language:', error);
          return;
        }
        
        if (data && data.language) {
          setOutputLanguage(data.language);
        }
      } catch (err) {
        console.error('Error getting strategy language:', err);
      }
    };
    
    loadStrategyLanguage();
  }, [strategyId]);

  // Handle statement generation
  const handleGenerateStatements = useCallback(async (additionalPrompt: string = '') => {
    try {
      // Combine system and user prompts with any additional input
      const combinedPrompt = additionalPrompt || customPrompt || '';
      
      return await generateStatements(combinedPrompt, outputLanguage);
    } catch (error) {
      console.error('Error in generation:', error);
      return { painStatements: [], gainStatements: [] };
    }
  }, [generateStatements, customPrompt, outputLanguage]);

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
  
  // Handle saving custom prompt
  const handleSaveCustomPrompt = useCallback(async (prompt: string) => {
    setCustomPrompt(prompt);
    toast.success('Custom prompt saved');
  }, []);

  // Update strategy state function
  const updateStrategyState = useCallback(async (nextState: StrategyState) => {
    try {
      console.log(`Updating strategy state to ${nextState}`);
      
      const { error } = await supabase
        .from('strategies')
        .update({ state: nextState })
        .eq('id', strategyId);
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to update strategy state");
        throw error;
      }
      
      console.log(`Strategy state updated successfully to ${nextState}`);
      return true;
    } catch (err) {
      console.error("Error in updateStrategyState:", err);
      return false;
    }
  }, [strategyId]);

  // Save statements and move to next step
  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      // First save the statements
      await saveStatements(false);
      
      // Then update the strategy state
      const success = await updateStrategyState(StrategyState.CHANNEL_STRATEGY);
      
      if (success) {
        toast.success('Statements saved and proceeding to next step');
        navigateToNextStep(StrategyState.STATEMENTS);
      } else {
        toast.error('Failed to update strategy state');
      }
    } catch (error) {
      toast.error('Failed to save statements and continue');
      console.error(error);
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, [saveStatements, navigateToNextStep, updateStrategyState]);
  
  // Handle navigation back to previous step
  const handleNavigateBack = useCallback(() => {
    navigateToPreviousStep(StrategyState.STATEMENTS);
  }, [navigateToPreviousStep]);

  // Just save statements without navigation (as draft)
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements(false);
      toast.success('Statements saved as draft');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements]);

  // Save statements as final
  const handleSaveFinal = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements(true); // Mark as final
      toast.success('Statements saved as final');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements]);

  // Handle adding new statement 
  const handleAddStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high' = 'medium') => {
    if (activeTab === 'pain') {
      addPainStatement(content, impact);
    } else {
      addGainStatement(content, impact);
    }
    setHasChanges(true);
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
    customPrompt,
    hasChanges,
    handleGenerateStatements,
    handleAddGeneratedStatements,
    handleSaveCustomPrompt,
    handleSaveAndContinue,
    handleNavigateBack,
    handleSave,
    handleSaveFinal,
    handleAddStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
  };
};

export default useStatementsModule;
