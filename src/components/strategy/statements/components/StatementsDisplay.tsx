
import React, { useMemo } from 'react';
import { PainStatement, GainStatement } from '../types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<string>('impact');
  const [editingStatement, setEditingStatement] = useState<PainStatement | GainStatement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const statements = activeTab === 'pain' ? painStatements : gainStatements;
  
  // Sort statements based on user preferences
  const sortedStatements = useMemo(() => {
    return statements
      .sort((a, b) => {
        if (sortBy === 'impact') {
          const impactOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
          return impactOrder[a.impact] - impactOrder[b.impact];
        } else if (sortBy === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        } else if (sortBy === 'oldest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        } else {
          return 0;
        }
      });
  }, [statements, sortBy]);

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
      <div className="flex justify-end items-center mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="impact">Impact (High → Low)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
