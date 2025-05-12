
import React, { useState, useMemo } from 'react';
import { PainStatement, GainStatement } from '../types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('impact');
  const [editingStatement, setEditingStatement] = useState<PainStatement | GainStatement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const statements = activeTab === 'pain' ? painStatements : gainStatements;
  
  // Filter and sort statements based on user preferences
  const filteredAndSortedStatements = useMemo(() => {
    return statements
      .filter(statement => 
        statement.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'impact') {
          const impactOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
          return impactOrder[a.impact] - impactOrder[b.impact];
        } else if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          return 0;
        }
      });
  }, [statements, searchTerm, sortBy]);

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
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 justify-between">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search statements..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedStatements.map((statement) => (
            <StatementItem
              key={statement.id}
              statement={statement}
              type={activeTab}
              onEdit={handleEditStatement}
              onDelete={handleDeleteStatement}
            />
          ))}
          {filteredAndSortedStatements.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {searchTerm ? (
                <p>No matching statements found. Try a different search term.</p>
              ) : (
                <p>No statements yet. Generate or add statements using the options above.</p>
              )}
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
