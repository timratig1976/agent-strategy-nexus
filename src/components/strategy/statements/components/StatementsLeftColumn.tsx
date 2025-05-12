
import React from 'react';
import { PainStatement, GainStatement } from '../types';
import UspCanvasDataPanel from './UspCanvasDataPanel';
import StatementsAIGenerator from './StatementsAIGenerator';
import CustomPromptDialog from './CustomPromptDialog';
import AddStatementForm from './AddStatementForm';

interface StatementsLeftColumnProps {
  activeTab: 'pain' | 'gain';
  uspCanvasData: any;
  isLoadingCanvasData: boolean;
  isGenerating: boolean;
  progress: number;
  customPrompt: string;
  onCustomPromptSave: (prompt: string) => void;
  onGenerate: (customPrompt?: string) => Promise<{
    painStatements: any[];
    gainStatements: any[];
  }>;
  onAddGeneratedStatements: (painStatements: any[], gainStatements: any[]) => void;
  onAddStatement: (content: string, impact: 'low' | 'medium' | 'high') => void;
}

const StatementsLeftColumn: React.FC<StatementsLeftColumnProps> = ({
  activeTab,
  uspCanvasData,
  isLoadingCanvasData,
  isGenerating,
  progress,
  customPrompt,
  onCustomPromptSave,
  onGenerate,
  onAddGeneratedStatements,
  onAddStatement
}) => {
  return (
    <div className="w-full lg:w-1/3 space-y-6">
      <UspCanvasDataPanel 
        uspCanvasData={uspCanvasData}
        isLoading={isLoadingCanvasData}
      />
      
      <StatementsAIGenerator
        onGenerate={onGenerate}
        onAddStatements={onAddGeneratedStatements}
        isGenerating={isGenerating}
        progress={progress}
        disabled={isLoadingCanvasData || !uspCanvasData}
        customPrompt={customPrompt}
      />
      
      <CustomPromptDialog 
        defaultPrompt={customPrompt} 
        onSavePrompt={onCustomPromptSave} 
      />
      
      <AddStatementForm 
        type={activeTab}
        onAdd={onAddStatement}
      />
    </div>
  );
};

export default StatementsLeftColumn;
