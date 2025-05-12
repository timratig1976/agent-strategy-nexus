
import { useState, useCallback } from 'react';

interface UseStatementsEditorProps {
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
}

export const useStatementsEditor = ({
  addPainStatement,
  addGainStatement,
  setHasChanges
}: UseStatementsEditorProps) => {
  const [activeTab, setActiveTab] = useState<'pain' | 'gain'>('pain');
  const [editingStatementId, setEditingStatementId] = useState<string | null>(null);

  // Handle adding new statement 
  const handleAddStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high' = 'medium') => {
    if (activeTab === 'pain') {
      addPainStatement(content, impact);
    } else {
      addGainStatement(content, impact);
    }
    setHasChanges(true);
  }, [activeTab, addPainStatement, addGainStatement, setHasChanges]);

  return {
    activeTab,
    setActiveTab,
    editingStatementId,
    setEditingStatementId,
    handleAddStatement
  };
};
