
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Import local hooks and types
import useCanvasDatabase from './hooks/useCanvasDatabase';
import { CanvasState, CanvasItem } from './types';

export const useUspCanvas = (canvasId: string) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.CUSTOMER_PROFILE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerItems, setCustomerItems] = useState<CanvasItem[]>([]);
  const [valueItems, setValueItems] = useState<CanvasItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Database operations
  const { 
    loading, 
    error, 
    saveCanvasSnapshot, 
    saveFinalCanvasState,
    loadCanvasHistory 
  } = useCanvasDatabase(canvasId);

  // Initialize canvas data
  useEffect(() => {
    if (canvasId) {
      const loadInitialData = async () => {
        try {
          // Load from database
          const historyData = await loadCanvasHistory();
          
          if (historyData && historyData.length > 0) {
            // Use most recent snapshot
            const latestSnapshot = historyData[0];
            if (latestSnapshot && latestSnapshot.snapshot_data) {
              // Extract canvas items from snapshot
              const { customerItems: loadedCustomerItems, valueItems: loadedValueItems } = latestSnapshot.snapshot_data;
              
              if (Array.isArray(loadedCustomerItems)) {
                setCustomerItems(loadedCustomerItems);
              }
              
              if (Array.isArray(loadedValueItems)) {
                setValueItems(loadedValueItems);
              }
              
              // Check if there's a final version
              if (latestSnapshot.metadata && latestSnapshot.metadata.isFinal) {
                setIsSaved(true);
              }
              
              toast.success('Canvas data loaded successfully from database');
            }
          } else {
            // No data found in history
            console.log('No canvas history data found for canvas ID:', canvasId);
          }
        } catch (err) {
          console.error('Error loading canvas data:', err);
          toast.error('Failed to load canvas data from database');
        }
      };
      
      loadInitialData();
    }
  }, [canvasId, loadCanvasHistory]);

  // Save canvas data to database only
  const saveCanvasData = useCallback(async (finalState: boolean = false) => {
    if (!canvasId) return;
    
    setIsProcessing(true);
    try {
      const canvasData = {
        customerItems,
        valueItems,
        timestamp: new Date().toISOString(),
      };
      
      // Save to database with final flag if needed
      const saved = finalState ? 
        await saveFinalCanvasState(canvasData) : 
        await saveCanvasSnapshot(canvasData);
      
      if (saved) {
        toast.success(finalState ? 
          'Canvas finalized and saved successfully' : 
          'Canvas saved successfully to database'
        );
        
        if (finalState) {
          setIsSaved(true);
        }
      } else {
        toast.error('Failed to save canvas');
      }
    } catch (err) {
      console.error('Error saving canvas:', err);
      toast.error('Failed to save canvas to database');
    } finally {
      setIsProcessing(false);
    }
  }, [canvasId, customerItems, valueItems, saveCanvasSnapshot, saveFinalCanvasState]);

  // Save as final state (completion)
  const finalizeCanvas = useCallback(async () => {
    return saveCanvasData(true);
  }, [saveCanvasData]);

  // Provide methods and state to components
  return {
    canvasState,
    setCanvasState,
    customerItems,
    setCustomerItems,
    valueItems,
    setValueItems,
    isProcessing,
    saveCanvasData,
    finalizeCanvas,
    isLoading: loading || isProcessing,
    error,
    isSaved,
    setIsSaved
  };
};

export default useUspCanvas;
