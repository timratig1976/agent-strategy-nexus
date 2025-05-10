
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UspCanvas, StoredAIResult } from "./types";
import { useCanvas } from "./hooks/useCanvas";
import { useCanvasItems } from "./hooks/useCanvasItems";
import { useValueMapItems } from "./hooks/useValueMapItems";
import { useCanvasDatabase, CanvasHistoryEntry } from "./hooks/useCanvasDatabase";

export const useUspCanvas = (strategyId: string, defaultActiveTab: string = "editor") => {
  // Main canvas state and utilities
  const {
    canvas,
    setCanvas,
    activeTab,
    setActiveTab,
    isSaved,
    setIsSaved,
    resetCanvas: resetCanvasState,
    applyAIGeneratedContent
  } = useCanvas();

  // Set default active tab
  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab, setActiveTab]);

  // Canvas database operations
  const {
    fetchCanvasData,
    loadCanvasSaveHistory,
    saveToDatabase,
    isLoading,
    error
  } = useCanvasDatabase(strategyId);

  // Canvas history state
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<CanvasHistoryEntry[]>([]);

  // Customer profile items operations
  const {
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    reorderCustomerJobs,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    reorderCustomerPains,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    reorderCustomerGains
  } = useCanvasItems(canvas, setCanvas, setIsSaved);

  // Value map items operations
  const {
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator
  } = useValueMapItems(canvas, setCanvas, setIsSaved);

  // Fetch canvas data on initial load
  useEffect(() => {
    if (strategyId) {
      refreshCanvasData();
    }
  }, [strategyId]);

  // Function to refresh canvas data
  const refreshCanvasData = async () => {
    const { canvas: loadedCanvas, history } = await fetchCanvasData();
    
    if (loadedCanvas) {
      setCanvas(loadedCanvas);
    }
    
    if (history && history.length > 0) {
      setCanvasSaveHistory(history);
    }
  };

  // Save canvas function
  const saveCanvas = useCallback(async (isFinal: boolean = false) => {
    if (!strategyId) return false;
    
    try {
      // Save to database
      const success = await saveToDatabase(canvas, isFinal);
      
      if (success) {
        setIsSaved(true);
        
        // Update history after save
        const updatedHistory = await loadCanvasSaveHistory();
        setCanvasSaveHistory(updatedHistory);
      }
      
      return success;
    } catch (err) {
      console.error("Error saving canvas:", err);
      toast.error("Failed to save canvas");
      return false;
    }
  }, [canvas, strategyId, saveToDatabase, loadCanvasSaveHistory, setIsSaved]);

  // Save progress
  const saveProgress = useCallback(async () => {
    await saveCanvas();
  }, [saveCanvas]);

  // Save final version
  const saveFinalVersion = useCallback(() => {
    if (!strategyId) return false;
    
    try {
      // First, check if there's any content to save
      if (
        canvas.customerJobs.length === 0 &&
        canvas.customerPains.length === 0 &&
        canvas.customerGains.length === 0
      ) {
        toast.error("Cannot save final version with empty canvas. Please add content first.");
        return false;
      }
      
      return saveCanvas(true);
    } catch (err) {
      console.error("Error saving final canvas:", err);
      toast.error("Failed to save final canvas");
      return false;
    }
  }, [canvas, strategyId, saveCanvas]);

  // Reset canvas to empty state
  const resetCanvas = useCallback(() => {
    resetCanvasState();
    toast.info("Canvas has been reset");
  }, [resetCanvasState]);

  return {
    canvas,
    activeTab,
    setActiveTab,
    isSaved,
    saveCanvas,
    resetCanvas,
    canvasSaveHistory,
    saveFinalVersion,
    isLoading,
    error,
    refreshCanvasData,
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    reorderCustomerJobs,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    reorderCustomerPains,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    reorderCustomerGains,
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    saveProgress,
    applyAIGeneratedContent,
  };
};
