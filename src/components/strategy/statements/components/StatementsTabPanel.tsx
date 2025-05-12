
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatementsList } from './index';
import { PainStatement, GainStatement } from '../types';

interface StatementsTabPanelProps {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high') => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high') => void;
  deletePainStatement: (id: string) => void;
  deleteGainStatement: (id: string) => void;
  editPainStatement: (id: string) => void;
  editGainStatement: (id: string) => void;
  initialActiveTab?: string;
}

const StatementsTabPanel: React.FC<StatementsTabPanelProps> = ({
  painStatements,
  gainStatements,
  addPainStatement,
  addGainStatement,
  deletePainStatement,
  deleteGainStatement,
  editPainStatement,
  editGainStatement,
  initialActiveTab = 'pain'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full mb-6">
        <TabsTrigger value="pain" className="flex-1">
          Pain Statements ({painStatements.length})
        </TabsTrigger>
        <TabsTrigger value="gain" className="flex-1">
          Gain Statements ({gainStatements.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pain">
        <StatementsList
          title="Pain Statements"
          statements={painStatements}
          onAddStatement={(content, impact) => addPainStatement(content, impact)}
          onDeleteStatement={deletePainStatement}
          onEditStatement={editPainStatement}
          type="pain"
          placeholder="Enter a pain statement that describes your customers' frustrations..."
        />
      </TabsContent>
      
      <TabsContent value="gain">
        <StatementsList
          title="Gain Statements"
          statements={gainStatements}
          onAddStatement={(content, impact) => addGainStatement(content, impact)}
          onDeleteStatement={deleteGainStatement}
          onEditStatement={editGainStatement}
          type="gain"
          placeholder="Enter a gain statement that describes your customers' desired outcomes..."
        />
      </TabsContent>
    </Tabs>
  );
};

export default StatementsTabPanel;
