
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Strategy } from '@/types/marketing';
import StatementsLeftColumn from './components/StatementsLeftColumn';
import StatementsRightColumn from './components/StatementsRightColumn';
import useStatementsModule from './hooks/useStatementsModule';

interface StatementsModuleProps {
  strategy: Strategy;
}

const StatementsModule: React.FC<StatementsModuleProps> = ({ strategy }) => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    painStatements,
    gainStatements,
    statementsError,
    generationError,
    isGenerating,
    progress,
    uspCanvasData,
    isLoadingCanvasData,
    editingStatementId,
    setEditingStatementId,
    customPrompt,
    handleGenerateStatements,
    handleAddGeneratedStatements,
    handleSaveCustomPrompt,
    handleSaveAndContinue,
    handleNavigateBack,
    handleSave, 
    handleAddStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
  } = useStatementsModule({ strategyId: strategy.id });
  
  // Show errors via toast only once, not repeatedly
  useEffect(() => {
    if (statementsError) {
      console.error("Statements loading error:", statementsError);
      toast.error(`Error loading statements: ${statementsError.message}`, {
        id: 'statements-error', // Add ID to prevent duplicate toasts
      });
    }
    
    if (generationError) {
      console.error("Generation error:", generationError);
      toast.error(`Error generating statements: ${generationError}`, {
        id: 'generation-error', // Add ID to prevent duplicate toasts
      });
    }
  }, [statementsError, generationError]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: USP Canvas Data and AI Generator */}
        <StatementsLeftColumn 
          activeTab={activeTab}
          uspCanvasData={uspCanvasData}
          isLoadingCanvasData={isLoadingCanvasData}
          isGenerating={isGenerating}
          progress={progress}
          customPrompt={customPrompt}
          onGenerate={handleGenerateStatements}
          onAddGeneratedStatements={handleAddGeneratedStatements}
          onCustomPromptSave={handleSaveCustomPrompt}
        />
        
        {/* Right column: Statements Display */}
        <StatementsRightColumn 
          painStatements={painStatements}
          gainStatements={gainStatements}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          onUpdatePainStatement={updatePainStatement}
          onUpdateGainStatement={updateGainStatement}
          onDeletePainStatement={deletePainStatement}
          onDeleteGainStatement={deleteGainStatement}
          onNavigateBack={handleNavigateBack}
          onSave={handleSave}
          onSaveAndContinue={handleSaveAndContinue}
          isLoading={isLoading}
          editingStatementId={editingStatementId}
          setEditingStatementId={setEditingStatementId}
          onAddStatement={(content) => handleAddStatement(content, 'medium')}
        />
      </div>
    </div>
  );
};

export default StatementsModule;
