
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

  // Save statements and move to next step - now with better handling
  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      // First save the statements
      await saveStatements(false);
    
      // Then update the strategy state using the consistent method
      const success = await updateStrategyState(StrategyState.CHANNEL_STRATEGY);
    
      if (success) {
        toast.success('Statements saved and proceeding to next step');
        // Allow navigation to continue even if state wasn't updated in database
        navigateToNextStep(StrategyState.STATEMENTS);
      } else {
        // Even if the update fails, we'll still try to navigate
        toast.warning('Strategy state update failed, but proceeding to next step');
        navigateToNextStep(StrategyState.STATEMENTS);
      }
    } catch (error) {
      console.error('Error in handleSaveAndContinue:', error);
      toast.error('Failed to save statements - please try again');
      // Even if there's an error, still try to navigate
      navigateToNextStep(StrategyState.STATEMENTS);
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, [saveStatements, navigateToNextStep, updateStrategyState, setHasChanges]);

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
