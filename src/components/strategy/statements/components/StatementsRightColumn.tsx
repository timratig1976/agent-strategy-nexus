
import React from 'react';
import { PainStatement, GainStatement } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import StatementsDisplay from './StatementsDisplay';
import CanvasNavigation from '@/components/marketing/modules/usp-canvas/components/CanvasNavigation';

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
  setEditingStatementId
}) => {
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
          
          <TabsContent value="pain" className="pt-4">
            <StatementsDisplay
              painStatements={painStatements}
              gainStatements={gainStatements}
              onUpdatePainStatement={onUpdatePainStatement}
              onUpdateGainStatement={onUpdateGainStatement}
              onDeletePainStatement={onDeletePainStatement}
              onDeleteGainStatement={onDeleteGainStatement}
              activeTab="pain"
            />
          </TabsContent>
          
          <TabsContent value="gain" className="pt-4">
            <StatementsDisplay
              painStatements={painStatements}
              gainStatements={gainStatements}
              onUpdatePainStatement={onUpdatePainStatement}
              onUpdateGainStatement={onUpdateGainStatement}
              onDeletePainStatement={onDeletePainStatement}
              onDeleteGainStatement={onDeleteGainStatement}
              activeTab="gain"
            />
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
