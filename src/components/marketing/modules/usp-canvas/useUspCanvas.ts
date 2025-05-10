
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Import local hooks and types
import useCanvasDatabase from './hooks/useCanvasDatabase';
import { useCanvasStorage, useLocalCanvasStorage } from './hooks';
import { CanvasState, CanvasItem, RelationshipType } from './types';

// Canvas data management hook
export const useUspCanvas = (canvasId: string) => {
  const [canvasState, setCanvasState] = useState<CanvasState>('customer_profile');
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

  // Fallback to local storage when database operations fail
  const { saveToLocalStorage, loadFromLocalStorage } = useLocalCanvasStorage();

  // Initialize canvas data
  useEffect(() => {
    if (canvasId) {
      const loadInitialData = async () => {
        try {
          // Try to load from database first
          const historyData = await loadCanvasHistory();
          
          if (historyData && historyData.length > 0) {
            // Use most recent snapshot
            const latestSnapshot = historyData[0];
            if (latestSnapshot && latestSnapshot.snapshot_data) {
              // Extract canvas items from snapshot
              const { customerItems, valueItems } = latestSnapshot.snapshot_data as any;
              
              if (Array.isArray(customerItems)) {
                setCustomerItems(customerItems);
              }
              
              if (Array.isArray(valueItems)) {
                setValueItems(valueItems);
              }
              
              toast.success('Canvas data loaded successfully');
              return;
            }
          }
          
          // Fall back to local storage if no database data
          const localData = loadFromLocalStorage(canvasId);
          if (localData) {
            setCustomerItems(localData.customerItems || []);
            setValueItems(localData.valueItems || []);
            toast.info('Loaded canvas from local storage');
          }
        } catch (err) {
          console.error('Error loading canvas data:', err);
          toast.error('Failed to load canvas data');
          
          // Try local storage as last resort
          const localData = loadFromLocalStorage(canvasId);
          if (localData) {
            setCustomerItems(localData.customerItems || []);
            setValueItems(localData.valueItems || []);
          }
        }
      };
      
      loadInitialData();
    }
  }, [canvasId]);

  // Save canvas data (to database and local storage)
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
      await saveCanvasSnapshot(canvasData as any);
      
      // Also save to local storage as backup
      saveToLocalStorage(canvasId, {
        customerItems,
        valueItems,
      });
      
      toast.success('Canvas saved successfully');
    } catch (err) {
      console.error('Error saving canvas:', err);
      toast.error('Failed to save canvas to database');
      
      // Fall back to local storage
      saveToLocalStorage(canvasId, {
        customerItems,
        valueItems,
      });
      toast.info('Canvas saved to local storage');
    } finally {
      setIsProcessing(false);
    }
  }, [canvasId, customerItems, valueItems, saveCanvasSnapshot, saveToLocalStorage]);

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
