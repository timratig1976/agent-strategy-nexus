
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useUspCanvas } from './useUspCanvas';
import { CanvasState } from './types';
import TabbedContent from '@/components/ui/tabbed-content';
import CanvasNavigation from './components/CanvasNavigation';
import CanvasTabs, { TABS } from './components/CanvasTabs';

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
    finalizeCanvas,
    isLoading,
    error
  } = useUspCanvas(canvasId);

  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Handle canvas item selection
  const [selectedCustomerItems, setSelectedCustomerItems] = useState<string[]>([]);
  const [selectedValueItems, setSelectedValueItems] = useState<string[]>([]);

  // Display error as message
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

  // Handle finalize and navigate
  const handleFinalizeAndContinue = useCallback(async () => {
    try {
      // Save with final flag
      await finalizeCanvas();
      
      // Navigate if we have a navigation function
      if (onNavigateNext) {
        onNavigateNext();
      }
    } catch (err) {
      console.error('Error finalizing canvas:', err);
      toast.error('Failed to finalize canvas');
    }
  }, [finalizeCanvas, onNavigateNext]);

  // Get tabs configuration - explicitly pass the tabs as TabItem[]
  const tabs = CanvasTabs({
    canvasId,
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
    saveCanvasData,
    activeTab,
    briefingContent: briefingContent || '',
    personaContent: personaContent || ''
  });

  return (
    <div className="usp-canvas-module">
      <TabbedContent 
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        className="w-full"
      />
      
      <CanvasNavigation
        onNavigateBack={onNavigateBack}
        onNavigateNext={onNavigateNext}
        prevStageLabel={prevStageLabel}
        nextStageLabel={nextStageLabel}
        onFinalize={handleFinalizeAndContinue}
        canFinalize={customerItems.length > 0 || valueItems.length > 0}
      />
    </div>
  );
};

export default UspCanvasModule;
