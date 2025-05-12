
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
  
  // Group statements by impact level for better organization
  const groupedStatements = useMemo(() => {
    const high = statements.filter(s => s.impact === 'high');
    const medium = statements.filter(s => s.impact === 'medium');
    const low = statements.filter(s => s.impact === 'low');
    
    return {
      high,
      medium,
      low
    };
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

  const renderImpactGroup = (statements: (PainStatement | GainStatement)[], label: string) => {
    if (statements.length === 0) return null;
    
    return (
      <div className="mb-5">
        <h3 className="text-sm font-medium mb-2 text-gray-700">{label} Impact</h3>
        <div className="space-y-2">
          {statements.map((statement) => (
            <StatementItem
              key={statement.id}
              statement={statement}
              type={activeTab}
              onEdit={handleEditStatement}
              onDelete={handleDeleteStatement}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[450px] pr-4">
        <div className="space-y-3">
          {statements.length > 0 ? (
            <>
              {renderImpactGroup(groupedStatements.high, "High")}
              {renderImpactGroup(groupedStatements.medium, "Medium")}
              {renderImpactGroup(groupedStatements.low, "Low")}
            </>
          ) : (
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
