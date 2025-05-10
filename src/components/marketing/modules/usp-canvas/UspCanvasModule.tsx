
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import UspCanvasModuleTabs from './components/UspCanvasModuleTabs';
import { useUspCanvas } from './useUspCanvas';
import { CanvasItem, CanvasState } from './types';
import UspCanvasOverview from './overview/UspCanvasOverview';

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

  return (
    <div className="usp-canvas-module">
      {activeTab === TABS.OVERVIEW ? (
        <UspCanvasOverview 
          canvas={{
            customerJobs: customerItems.filter(item => item.rating === 'high' || item.rating === 'medium'),
            customerPains: customerItems.filter(item => item.rating === 'high' || item.rating === 'medium'),
            customerGains: customerItems.filter(item => item.rating === 'high' || item.rating === 'medium'),
            productServices: valueItems.filter(item => item.rating === 'high' || item.rating === 'medium'),
            painRelievers: valueItems.filter(item => item.rating === 'high' || item.rating === 'medium'),
            gainCreators: valueItems.filter(item => item.rating === 'high' || item.rating === 'medium')
          }}
          briefingContent={briefingContent}
        />
      ) : (
        <UspCanvasModuleTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
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
          canvasId={canvasId}
          onSaveCanvas={saveCanvasData}
          isProcessing={isProcessing}
        />
      )}
      
      {(onNavigateBack || onNavigateNext) && (
        <div className="flex justify-between mt-8 pt-4 border-t">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              {prevStageLabel || 'Back'}
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {nextStageLabel || 'Next'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UspCanvasModule;
