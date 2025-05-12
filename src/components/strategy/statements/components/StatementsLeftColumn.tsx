
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UspCanvasDataPanel from './UspCanvasDataPanel';
import StatementsAIGenerator from './StatementsAIGenerator';
import AddStatementForm from './AddStatementForm';

interface StatementsLeftColumnProps {
  activeTab: 'pain' | 'gain';
  uspCanvasData: any;
  isLoadingCanvasData: boolean;
  isGenerating: boolean;
  progress: number;
  customPrompt?: string;
  onGenerate: (customPrompt?: string) => Promise<any>;
  onAddGeneratedStatements: (painStatements: any[], gainStatements: any[]) => void;
  onAddStatement: (content: string, impact: 'low' | 'medium' | 'high') => void;
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
  onAddStatement,
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
      
      {/* Add Statement Form */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-muted/50">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="pain">Add Pain Statement</TabsTrigger>
              <TabsTrigger value="gain">Add Gain Statement</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <AddStatementForm 
            type={activeTab}
            onAdd={onAddStatement}
          />
        </div>
      </Card>
    </div>
  );
};

export default StatementsLeftColumn;
