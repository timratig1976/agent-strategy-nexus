
import React, { useMemo, useState } from 'react';
import { PainStatement, GainStatement } from '../types';
import { ScrollArea } from "@/components/ui/scroll-area";
import StatementItem from './StatementItem';
import StatementEditDialog from './StatementEditDialog';

interface StatementsDisplayProps {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  onUpdatePainStatement: (id: string, updates: Partial<PainStatement>) => void;
  onUpdateGainStatement: (id: string, updates: Partial<GainStatement>) => void;
  onDeletePainStatement: (id: string) => void;
  onDeleteGainStatement: (id: string) => void;
  activeTab: 'pain' | 'gain';
}

const StatementsDisplay: React.FC<StatementsDisplayProps> = ({
  painStatements,
  gainStatements,
  onUpdatePainStatement,
  onUpdateGainStatement,
  onDeletePainStatement,
  onDeleteGainStatement,
  activeTab
}) => {
  const [editingStatement, setEditingStatement] = useState<PainStatement | GainStatement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const statements = activeTab === 'pain' ? painStatements : gainStatements;
  
  // Get all statements without sorting
  const sortedStatements = useMemo(() => {
    return [...statements];
  }, [statements]);

  const handleEditStatement = (id: string) => {
    const statement = statements.find(s => s.id === id) || null;
    setEditingStatement(statement);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatement = (id: string, updates: Partial<PainStatement | GainStatement>) => {
    if (activeTab === 'pain') {
      onUpdatePainStatement(id, updates);
    } else {
      onUpdateGainStatement(id, updates);
    }
  };

  const handleDeleteStatement = (id: string) => {
    if (activeTab === 'pain') {
      onDeletePainStatement(id);
    } else {
      onDeleteGainStatement(id);
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[450px] pr-4">
        <div className="flex flex-wrap gap-3">
          {sortedStatements.map((statement) => (
            <div className="w-full" key={statement.id}>
              <StatementItem
                statement={statement}
                type={activeTab}
                onEdit={handleEditStatement}
                onDelete={handleDeleteStatement}
              />
            </div>
          ))}
          {sortedStatements.length === 0 && (
            <div className="w-full text-center py-8 text-gray-500">
              <p>No statements yet. Generate or add statements using the options above.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <StatementEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        statement={editingStatement}
        type={activeTab}
        onSave={handleUpdateStatement}
      />
    </div>
  );
};

export default StatementsDisplay;
