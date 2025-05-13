
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { StrategyState } from '@/types/marketing';
import useStrategyNavigation from '@/hooks/useStrategyNavigation';

interface UseStatementsNavigationProps {
  strategyId: string;
  saveStatements: (isFinal: boolean) => Promise<boolean>;
  updateStrategyState: (nextState: StrategyState) => Promise<boolean>;
  setHasChanges: (hasChanges: boolean) => void;
}

export const useStatementsNavigation = ({
  strategyId,
  saveStatements,
  updateStrategyState,
  setHasChanges
}: UseStatementsNavigationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { navigateToNextStep, navigateToPreviousStep } = useStrategyNavigation({
    strategyId
  });

  // Modified save and continue flow - we'll avoid dual state updates
  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Starting handleSaveAndContinue flow");
      
      // First save the statements
      const saveSuccess = await saveStatements(false);
      if (!saveSuccess) {
        console.error("Failed to save statements");
        toast.error('Failed to save statements - please try again');
        setIsLoading(false);
        return;
      }
      
      console.log("Statements saved successfully, navigating to next step");
      
      // Skip the state update here and just navigate to the next step
      // The StrategyStageContainer component will handle updating the database state
      // This prevents duplicate state updates that might be causing the loop
      navigateToNextStep(StrategyState.STATEMENTS);
      
      toast.success('Statements saved and proceeding to next step');
    } catch (error) {
      console.error('Error in handleSaveAndContinue:', error);
      toast.error('Failed to save statements - please try again');
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, [saveStatements, navigateToNextStep, setHasChanges]);

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
  }, [saveStatements, setHasChanges]);

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
  }, [saveStatements, setHasChanges]);

  return {
    isLoading,
    handleSaveAndContinue,
    handleNavigateBack,
    handleSave,
    handleSaveFinal
  };
};
