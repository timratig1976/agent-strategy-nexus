
import React, { useState } from 'react';
import { PainStatement, GainStatement } from '../types';
import UspCanvasDataPanel from './UspCanvasDataPanel';
import StatementsAIGenerator from './StatementsAIGenerator';
import CustomPromptDialog from './CustomPromptDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [statementContent, setStatementContent] = useState('');
  
  const handleAddStatement = () => {
    if (statementContent.trim()) {
      // Always use 'medium' as the default impact level since we're removing the selection
      onAddStatement(statementContent, 'medium');
      setStatementContent('');
    }
  };

  const isPain = activeTab === 'pain';

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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isPain ? 'Add Pain Statement' : 'Add Gain Statement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={statementContent}
              onChange={(e) => setStatementContent(e.target.value)}
              placeholder={isPain 
                ? 'E.g., Customers struggle with organizing their tasks efficiently...' 
                : 'E.g., Customers desire a simplified workflow that saves time...'}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey && statementContent.trim()) {
                  e.preventDefault();
                  handleAddStatement();
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">Press Ctrl+Enter to add quickly</p>
          </div>
          <Button 
            onClick={handleAddStatement}
            disabled={!statementContent.trim()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {isPain ? 'Pain' : 'Gain'} Statement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementsLeftColumn;
