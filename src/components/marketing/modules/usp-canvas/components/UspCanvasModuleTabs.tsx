
import React from 'react';
import { TabsList } from './tabs';
import CanvasTab from './tabs/CanvasTab';
import VisualizationTab from './tabs/VisualizationTab';
import AIGeneratorTab from './tabs/AIGeneratorTab';
import HistoryTab from './tabs/HistoryTab';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CanvasState, CanvasItem } from '../types';

interface UspCanvasModuleTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  customerItems: CanvasItem[];
  valueItems: CanvasItem[];
  setCustomerItems: (items: CanvasItem[]) => void;
  setValueItems: (items: CanvasItem[]) => void;
  selectedCustomerItems: string[];
  selectedValueItems: string[];
  setSelectedCustomerItems: (items: string[]) => void;
  setSelectedValueItems: (items: string[]) => void;
  canvasId: string;
  onSaveCanvas: () => Promise<void>;
  isProcessing: boolean;
}

const UspCanvasModuleTabs: React.FC<UspCanvasModuleTabsProps> = ({
  activeTab,
  onTabChange,
  canvasState,
  setCanvasState,
  customerItems,
  valueItems,
  setCustomerItems,
  setValueItems,
  selectedCustomerItems,
  selectedValueItems,
  setSelectedCustomerItems,
  setSelectedValueItems,
  canvasId,
  onSaveCanvas,
  isProcessing
}) => {
  // Define history items type properly
  type HistoryItem = {
    id: string;
    canvas_id: string;
    snapshot_data: any;
    created_at: string;
    metadata?: Record<string, any>;
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        onSave={onSaveCanvas}
        isProcessing={isProcessing}
      />
      
      <TabsContent value="canvas" className="mt-6">
        <CanvasTab
          canvasState={canvasState}
          setCanvasState={setCanvasState}
          customerItems={customerItems}
          valueItems={valueItems}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
          selectedCustomerItems={selectedCustomerItems}
          selectedValueItems={selectedValueItems}
          setSelectedCustomerItems={setSelectedCustomerItems}
          setSelectedValueItems={setSelectedValueItems}
          onSaveCanvas={onSaveCanvas}
        />
      </TabsContent>
      
      <TabsContent value="visualization">
        <VisualizationTab
          customerItems={customerItems}
          valueItems={valueItems}
          selectedCustomerItems={selectedCustomerItems}
          selectedValueItems={selectedValueItems}
        />
      </TabsContent>
      
      <TabsContent value="ai_gen">
        <AIGeneratorTab
          canvasId={canvasId}
          customerItems={customerItems}
          valueItems={valueItems}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
          onSaveCanvas={onSaveCanvas}
        />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryTab
          canvasId={canvasId}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UspCanvasModuleTabs;
