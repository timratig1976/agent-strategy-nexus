
import React from 'react';
import { PainStatement, GainStatement } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import StatementsDisplay from './StatementsDisplay';
import CanvasNavigation from '@/components/marketing/modules/usp-canvas/components/CanvasNavigation';
import { Textarea } from "@/components/ui/textarea";
import { Card } from '@/components/ui/card';

interface StatementsRightColumnProps {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  activeTab: 'pain' | 'gain';
  onActiveTabChange: (tab: 'pain' | 'gain') => void;
  onUpdatePainStatement: (id: string, updates: Partial<PainStatement>) => void;
  onUpdateGainStatement: (id: string, updates: Partial<GainStatement>) => void;
  onDeletePainStatement: (id: string) => void;
  onDeleteGainStatement: (id: string) => void;
  onNavigateBack: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
  isLoading: boolean;
  editingStatementId: string | null;
  setEditingStatementId: (id: string | null) => void;
  onAddStatement: (content: string) => void;
}

const StatementsRightColumn: React.FC<StatementsRightColumnProps> = ({
  painStatements,
  gainStatements,
  activeTab,
  onActiveTabChange,
  onUpdatePainStatement,
  onUpdateGainStatement,
  onDeletePainStatement,
  onDeleteGainStatement,
  onNavigateBack,
  onSave,
  onSaveAndContinue,
  isLoading,
  editingStatementId,
  setEditingStatementId,
  onAddStatement
}) => {
  const [newStatementContent, setNewStatementContent] = React.useState('');

  const handleAddStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatementContent.trim()) {
      onAddStatement(newStatementContent);
      setNewStatementContent('');
    }
  };

  return (
    <div className="w-full lg:w-2/3">
      <div className="bg-white rounded-md border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Pain & Gain Statements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create compelling statements that address customer pains and desires for use in your marketing materials.
          </p>
        </div>
        
        <Tabs 
          defaultValue="pain" 
          className="p-4" 
          onValueChange={(v) => onActiveTabChange(v as 'pain' | 'gain')}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pain">
              Pain Statements
              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                {painStatements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="gain">
              Gain Statements
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                {gainStatements.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pain" className="pt-4 space-y-4">
            <StatementsDisplay
              painStatements={painStatements}
              gainStatements={gainStatements}
              onUpdatePainStatement={onUpdatePainStatement}
              onUpdateGainStatement={onUpdateGainStatement}
              onDeletePainStatement={onDeletePainStatement}
              onDeleteGainStatement={onDeleteGainStatement}
              activeTab="pain"
            />
            
            <Card className="p-4 bg-muted/50">
              <form onSubmit={handleAddStatement}>
                <div className="space-y-4">
                  <Textarea
                    value={newStatementContent}
                    onChange={(e) => setNewStatementContent(e.target.value)}
                    placeholder="Add a new pain statement here..."
                    className="min-h-[80px]"
                  />
                  <Button type="submit" className="w-full">Add Pain Statement</Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="gain" className="pt-4 space-y-4">
            <StatementsDisplay
              painStatements={painStatements}
              gainStatements={gainStatements}
              onUpdatePainStatement={onUpdatePainStatement}
              onUpdateGainStatement={onUpdateGainStatement}
              onDeletePainStatement={onDeletePainStatement}
              onDeleteGainStatement={onDeleteGainStatement}
              activeTab="gain"
            />
            
            <Card className="p-4 bg-muted/50">
              <form onSubmit={handleAddStatement}>
                <div className="space-y-4">
                  <Textarea
                    value={newStatementContent}
                    onChange={(e) => setNewStatementContent(e.target.value)}
                    placeholder="Add a new gain statement here..."
                    className="min-h-[80px]"
                  />
                  <Button type="submit" className="w-full">Add Gain Statement</Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Statements
        </Button>
        
        <CanvasNavigation 
          onNavigateBack={onNavigateBack}
          onFinalize={onSaveAndContinue}
          canFinalize={painStatements.length > 0 && gainStatements.length > 0}
          prevStageLabel="Back to USP Canvas"
          nextStageLabel="Continue to Channel Strategy"
        />
      </div>
    </div>
  );
};

export default StatementsRightColumn;
