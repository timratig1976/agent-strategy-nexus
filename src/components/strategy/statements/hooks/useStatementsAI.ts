
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseStatementsAIProps {
  handleGenerateStatements: (additionalPrompt: string) => Promise<any>;
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
}

export const useStatementsAI = ({
  handleGenerateStatements,
  addPainStatement,
  addGainStatement
}: UseStatementsAIProps) => {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
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

  return {
    customPrompt,
    setCustomPrompt,
    handleAddGeneratedStatements,
    handleSaveCustomPrompt
  };
};
