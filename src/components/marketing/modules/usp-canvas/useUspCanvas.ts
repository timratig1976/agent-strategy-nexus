
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

  // Database operations
  const { 
    loading, 
    error, 
    saveCanvasSnapshot, 
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
  const saveCanvasData = useCallback(async () => {
    if (!canvasId) return;
    
    setIsProcessing(true);
    try {
      const canvasData = {
        customerItems,
        valueItems,
        timestamp: new Date().toISOString(),
      };
      
      // Save to database
      const saved = await saveCanvasSnapshot(canvasData);
      
      if (saved) {
        toast.success('Canvas saved successfully to database');
      } else {
        toast.error('Failed to save canvas');
      }
    } catch (err) {
      console.error('Error saving canvas:', err);
      toast.error('Failed to save canvas to database');
    } finally {
      setIsProcessing(false);
    }
  }, [canvasId, customerItems, valueItems, saveCanvasSnapshot]);

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
    isLoading: loading || isProcessing,
    error
  };
};

export default useUspCanvas;
