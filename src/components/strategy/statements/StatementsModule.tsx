
import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { useStatementsData, useStatementsGenerator } from './hooks';
import { useUspCanvasData } from './hooks/useUspCanvasData';
import { 
  StatementsHeader, 
  StatementsFooter, 
  StatementsAIGenerator,
  StatementsTabPanel,
  StatementsLoading
} from './components';
import { useStrategyNavigation } from '@/hooks/useStrategyNavigation';
import { StrategyState } from '@/types/marketing';
import { useNavigate } from 'react-router-dom';

interface StatementsModuleProps {
  strategy: any;  // Strategy object
  uspCanvasData?: any;  // USP Canvas data to use for generation
}

const StatementsModule: React.FC<StatementsModuleProps> = ({
  strategy,
  uspCanvasData
}) => {
  const navigate = useNavigate();
  const strategyId = strategy?.id;
  
  // Fetch USP Canvas data if not provided
  const { uspData } = useUspCanvasData(strategyId);
  const finalUspData = uspCanvasData || uspData;
  
  // Hooks for data management and navigation
  const { 
    painStatements, 
    gainStatements,
    isLoading,
    isSaving,
    hasChanges,
    addPainStatement,
    addGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements
  } = useStatementsData({ strategyId });
  
  const { navigateToPreviousStep, navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId,
    onRefetch: () => {
      // Navigate to new URL after state change
      navigate(`/strategy/${strategyId}`);
    }
  });
  
  const { 
    generateStatements, 
    isGenerating, 
    progressPercent 
  } = useStatementsGenerator({ strategyId });

  // Handle AI generation
  const handleGenerate = useCallback(async () => {
    if (!finalUspData) {
      toast.error('No USP Canvas data available for generation');
      return { painStatements: [], gainStatements: [] };
    }

    return await generateStatements(finalUspData);
  }, [generateStatements, finalUspData]);

  // Handle adding all generated statements
  const handleAddGeneratedStatements = useCallback((painStmts: any[], gainStmts: any[]) => {
    // Add pain statements
    painStmts.forEach(item => {
      addPainStatement(item.content, item.impact, true);
    });
    
    // Add gain statements
    gainStmts.forEach(item => {
      addGainStatement(item.content, item.impact, true);
    });
  }, [addPainStatement, addGainStatement]);

  // Handle navigation back to USP Canvas
  const handleNavigateBack = useCallback(() => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    // Check for unsaved changes
    if (hasChanges) {
      if (confirm('You have unsaved changes. Do you want to save before going back?')) {
        saveStatements().then(() => {
          navigateToPreviousStep(StrategyState.STATEMENTS);
        });
      } else {
        navigateToPreviousStep(StrategyState.STATEMENTS);
      }
    } else {
      navigateToPreviousStep(StrategyState.STATEMENTS);
    }
  }, [strategyId, hasChanges, saveStatements, navigateToPreviousStep]);

  // Handle navigation to Funnel Strategy
  const handleContinue = useCallback(() => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    // Check for unsaved changes
    if (hasChanges) {
      toast.error('Please save your changes before continuing');
      return;
    }
    
    navigateToNextStep(StrategyState.STATEMENTS);
  }, [strategyId, hasChanges, navigateToNextStep]);

  // Handle save with confirmation of continued navigation
  const handleSaveAndContinue = useCallback(async () => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    try {
      await saveStatements();
      handleContinue();
    } catch (error) {
      console.error('Error saving statements:', error);
      toast.error('Failed to save statements');
    }
  }, [strategyId, saveStatements, handleContinue]);

  if (isLoading) {
    return <StatementsLoading />;
  }

  return (
    <div className="space-y-0">
      <Card className="overflow-hidden">
        <StatementsHeader
          onNavigateBack={handleNavigateBack}
          isNavigating={isNavigating}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Left column: AI Generator */}
          <div className="md:col-span-4">
            <StatementsAIGenerator
              onGenerate={handleGenerate}
              onAddStatements={handleAddGeneratedStatements}
              isGenerating={isGenerating}
              progress={progressPercent}
              disabled={!finalUspData}
            />
          </div>
          
          {/* Right column: Tabs with statements lists */}
          <div className="md:col-span-8">
            <StatementsTabPanel
              painStatements={painStatements}
              gainStatements={gainStatements}
              addPainStatement={addPainStatement}
              addGainStatement={addGainStatement}
              deletePainStatement={deletePainStatement}
              deleteGainStatement={deleteGainStatement}
            />
          </div>
        </div>
        
        <StatementsFooter
          onSave={saveStatements}
          onContinue={handleSaveAndContinue}
          isSaving={isSaving}
          hasChanges={hasChanges}
          isNavigating={isNavigating}
          canContinue={painStatements.length > 0 || gainStatements.length > 0}
        />
      </Card>
    </div>
  );
};

export default StatementsModule;
