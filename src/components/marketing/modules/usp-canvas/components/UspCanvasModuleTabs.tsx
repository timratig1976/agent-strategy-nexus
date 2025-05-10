
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
  // Determine which tab content to render based on activeTab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'canvas':
        return (
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
        );
      case 'visualization':
        return (
          <VisualizationTab
            customerItems={customerItems}
            valueItems={valueItems}
            selectedCustomerItems={selectedCustomerItems}
            selectedValueItems={selectedValueItems}
            canvasId={canvasId}
          />
        );
      case 'ai_gen':
        return (
          <AIGeneratorTab
            canvasId={canvasId}
            customerItems={customerItems}
            valueItems={valueItems}
            setCustomerItems={setCustomerItems}
            setValueItems={setValueItems}
            onSaveCanvas={onSaveCanvas}
          />
        );
      case 'history':
        return (
          <HistoryTab
            canvasId={canvasId}
            setCustomerItems={setCustomerItems}
            setValueItems={setValueItems}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList 
        activeTab={activeTab} 
        onSave={onSaveCanvas}
        isProcessing={isProcessing}
        onTabChange={onTabChange}
      />
      
      <TabsContent value="canvas" className="mt-6">
        {activeTab === 'canvas' && renderTabContent()}
      </TabsContent>
      
      <TabsContent value="visualization" className="mt-6">
        {activeTab === 'visualization' && renderTabContent()}
      </TabsContent>
      
      <TabsContent value="ai_gen" className="mt-6">
        {activeTab === 'ai_gen' && renderTabContent()}
      </TabsContent>
      
      <TabsContent value="history" className="mt-6">
        {activeTab === 'history' && renderTabContent()}
      </TabsContent>
    </Tabs>
  );
};

export default UspCanvasModuleTabs;
