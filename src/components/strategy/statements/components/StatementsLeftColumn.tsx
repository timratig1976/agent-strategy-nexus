
import React from 'react';
import { Card } from '@/components/ui/card';
import UspCanvasDataPanel from './UspCanvasDataPanel';
import StatementsAIGenerator from './StatementsAIGenerator';

interface StatementsLeftColumnProps {
  activeTab: 'pain' | 'gain';
  uspCanvasData: any;
  isLoadingCanvasData: boolean;
  isGenerating: boolean;
  progress: number;
  customPrompt?: string;
  onGenerate: (customPrompt?: string) => Promise<any>;
  onAddGeneratedStatements: (painStatements: any[], gainStatements: any[]) => void;
  onCustomPromptSave?: (prompt: string) => void;
}

const StatementsLeftColumn: React.FC<StatementsLeftColumnProps> = ({
  activeTab,
  uspCanvasData,
  isLoadingCanvasData,
  isGenerating,
  progress,
  customPrompt,
  onGenerate,
  onAddGeneratedStatements,
  onCustomPromptSave,
}) => {
  const isDataAvailable = uspCanvasData && 
    Object.values(uspCanvasData).some(arr => Array.isArray(arr) && arr.length > 0);
  
  return (
    <div className="w-full lg:w-1/3 space-y-6">
      {/* USP Canvas Data Panel */}
      <UspCanvasDataPanel 
        uspCanvasData={uspCanvasData}
        isLoading={isLoadingCanvasData}
      />
      
      {/* AI Generator */}
      <StatementsAIGenerator 
        onGenerate={onGenerate}
        onAddStatements={onAddGeneratedStatements}
        isGenerating={isGenerating}
        progress={progress}
        disabled={!isDataAvailable}
        customPrompt={customPrompt}
      />
    </div>
  );
};

export default StatementsLeftColumn;
