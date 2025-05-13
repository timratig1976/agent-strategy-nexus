import { useState, useCallback, useEffect } from 'react';
import { StrategyState } from '@/types/marketing';
import { useStatementsData } from './useStatementsData';
import useStatementsGenerator from './useStatementsGenerator';
import { useAgentPrompt } from '@/hooks/useAgentPrompt';
import { supabase } from '@/integrations/supabase/client';
import { useStrategyStateUpdate } from './useStrategyStateUpdate';
import { useStatementsNavigation } from './useStatementsNavigation';
import { useStatementsAI } from './useStatementsAI';
import { useStatementsEditor } from './useStatementsEditor';

interface UseStatementsModuleProps {
  strategyId: string;
}

export const useStatementsModule = ({ strategyId }: UseStatementsModuleProps) => {
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  // Load custom prompt from settings
  const { userPrompt, systemPrompt } = useAgentPrompt('statements');
  
  // Use our strategy state update hook
  const { updateStrategyState } = useStrategyStateUpdate(strategyId);
  
  // Use our statements data hook
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
  
  // Use our statements generator hook
  const {
    generateStatements,
    isGenerating,
    progress,
    error: generationError,
    uspCanvasData,
    isLoadingCanvasData,
    debugInfo
  } = useStatementsGenerator(strategyId);

  // Use our statements editor hook
  const {
    activeTab,
    setActiveTab,
    editingStatementId,
    setEditingStatementId,
    handleAddStatement
  } = useStatementsEditor({
    addPainStatement,
    addGainStatement,
    setHasChanges: setHasLocalChanges
  });

  // Load strategy language for AI
  const [outputLanguage, setOutputLanguage] = useState<string>('english');
  const [generatorDebugInfo, setGeneratorDebugInfo] = useState<any>(null);
  
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
      const combinedPrompt = additionalPrompt || '';
      
      const result = await generateStatements(combinedPrompt, outputLanguage);
      
      // Store the debug info
      setGeneratorDebugInfo(debugInfo);
      
      return result;
    } catch (error) {
      console.error('Error in generation:', error);
      return { painStatements: [], gainStatements: [] };
    }
  }, [generateStatements, outputLanguage, debugInfo]);

  // Use our statements AI hook
  const {
    customPrompt,
    handleAddGeneratedStatements,
    handleSaveCustomPrompt
  } = useStatementsAI({
    handleGenerateStatements,
    addPainStatement,
    addGainStatement
  });

  // Use our statements navigation hook
  const {
    isLoading,
    handleSaveAndContinue,
    handleNavigateBack,
    handleSave,
    handleSaveFinal
  } = useStatementsNavigation({
    strategyId,
    saveStatements,
    updateStrategyState,
    setHasChanges: setHasLocalChanges
  });

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
    generatorDebugInfo,
  };
};

export default useStatementsModule;
