
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import UspCanvasModuleTabs from './components/UspCanvasModuleTabs';
import { useUspCanvas } from './useUspCanvas';
import { CanvasItem, CanvasState } from './types';

// Known tab values
const TABS = {
  CANVAS: 'canvas',
  VISUALIZATION: 'visualization',
  AI_GEN: 'ai_gen',
  HISTORY: 'history'
};

const UspCanvasModule = ({ projectId = '', strategyId = '' }) => {
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

  const [activeTab, setActiveTab] = useState(TABS.CANVAS);

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
    </div>
  );
};

export default UspCanvasModule;
