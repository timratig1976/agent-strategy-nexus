
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useUspCanvas } from './useUspCanvas';
import { 
  CanvasItem, 
  CanvasState, 
  CustomerJob, 
  CustomerPain, 
  CustomerGain, 
  ProductService, 
  PainReliever, 
  GainCreator 
} from './types';
import UspCanvasOverview from './overview/UspCanvasOverview';
import TabbedContent from '@/components/ui/tabbed-content';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CanvasTab from './components/tabs/CanvasTab';
import VisualizationTab from './components/tabs/VisualizationTab';
import AIGeneratorTab from './components/tabs/AIGeneratorTab';
import HistoryTab from './components/tabs/HistoryTab';

// Known tab values
const TABS = {
  CANVAS: 'canvas',
  VISUALIZATION: 'visualization',
  AI_GEN: 'ai_gen',
  HISTORY: 'history',
  OVERVIEW: 'overview'
};

interface UspCanvasModuleProps {
  projectId?: string;
  strategyId?: string;
  briefingContent?: string;
  personaContent?: string;
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  prevStageLabel?: string;
  nextStageLabel?: string;
  defaultActiveTab?: string;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({
  projectId = '',
  strategyId = '',
  briefingContent = '',
  personaContent = '',
  onNavigateBack,
  onNavigateNext,
  prevStageLabel,
  nextStageLabel,
  defaultActiveTab = TABS.CANVAS
}) => {
  const canvasId = projectId || strategyId || uuidv4();
  
  // Use the main canvas hook
  const {
    canvasState,
    setCanvasState,
    customerItems,
    setCustomerItems,
    valueItems,
    setValueItems,
    isProcessing,
    saveCanvasData,
    isLoading,
    error
  } = useUspCanvas(canvasId);

  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Handle canvas item selection
  const [selectedCustomerItems, setSelectedCustomerItems] = useState<string[]>([]);
  const [selectedValueItems, setSelectedValueItems] = useState<string[]>([]);

  // Display error as message rather than directly using the error object
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred with the canvas');
      console.error('Canvas error:', error);
    }
  }, [error]);

  // Handle tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Reset selected items when switching canvas
  useEffect(() => {
    setSelectedCustomerItems([]);
    setSelectedValueItems([]);
  }, [canvasState]);

  // Convert CanvasItem arrays to specific types needed for UspCanvasOverview
  const mapCanvasToSpecificTypes = () => {
    const customerJobs: CustomerJob[] = customerItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        priority: item.rating,
        isAIGenerated: item.isAIGenerated
      }));
      
    const customerPains: CustomerPain[] = customerItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        severity: item.rating,
        isAIGenerated: item.isAIGenerated
      }));
      
    const customerGains: CustomerGain[] = customerItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        importance: item.rating,
        isAIGenerated: item.isAIGenerated
      }));
      
    const productServices: ProductService[] = valueItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedJobIds: []
      }));
      
    const painRelievers: PainReliever[] = valueItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedPainIds: []
      }));
      
    const gainCreators: GainCreator[] = valueItems
      .filter(item => item.rating === 'high' || item.rating === 'medium')
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedGainIds: []
      }));
      
    return {
      customerJobs,
      customerPains,
      customerGains,
      productServices,
      painRelievers,
      gainCreators
    };
  };

  // Define all available tabs
  const tabs = [
    {
      id: TABS.CANVAS,
      label: "Canvas",
      content: (
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
          onSaveCanvas={saveCanvasData}
        />
      )
    },
    {
      id: TABS.VISUALIZATION,
      label: "Visualization",
      content: (
        <VisualizationTab
          customerItems={customerItems}
          valueItems={valueItems}
          selectedCustomerItems={selectedCustomerItems}
          selectedValueItems={selectedValueItems}
          canvasId={canvasId}
        />
      )
    },
    {
      id: TABS.AI_GEN,
      label: "AI Generator",
      content: (
        <AIGeneratorTab
          canvasId={canvasId}
          customerItems={customerItems}
          valueItems={valueItems}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
          onSaveCanvas={saveCanvasData}
        />
      )
    },
    {
      id: TABS.HISTORY,
      label: "History",
      content: (
        <HistoryTab
          canvasId={canvasId}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
        />
      )
    },
    {
      id: TABS.OVERVIEW,
      label: "Overview",
      content: (
        <UspCanvasOverview 
          canvas={mapCanvasToSpecificTypes()}
          briefingContent={briefingContent}
          personaContent={personaContent}
        />
      )
    }
  ];

  return (
    <div className="usp-canvas-module">
      <TabbedContent 
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        className="w-full"
      />
      
      {(onNavigateBack || onNavigateNext) && (
        <div className="flex justify-between mt-8 pt-4 border-t">
          {onNavigateBack && (
            <Button
              onClick={onNavigateBack}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {prevStageLabel || 'Back'}
            </Button>
          )}
          {onNavigateNext && (
            <Button
              onClick={onNavigateNext}
            >
              {nextStageLabel || 'Next'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UspCanvasModule;
