
import { useState, useEffect } from 'react';
import { UspCanvas } from '../types';
import { toast } from 'sonner';
import { useLocalCanvasStorage } from './useLocalCanvasStorage';
import { CanvasRepository } from './db/canvasRepository';

export const useCanvasData = (strategyId?: string) => {
  const [canvasData, setCanvasData] = useState<UspCanvas | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Use local storage hook to manage local cache
  const { canvasSaveHistory, saveToLocalStorage, isLoading: isLocalStorageLoading } = useLocalCanvasStorage(strategyId);

  // Fetch the canvas data from the database with fallback to local storage
  const fetchCanvasData = async () => {
    if (!strategyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from database with a timeout
      const fetchPromise = CanvasRepository.fetchCanvasData(strategyId);
      
      // Create a promise that resolves after a timeout
      const timeoutPromise = new Promise<{ canvas: UspCanvas | null, error: string | null }>((resolve) => {
        setTimeout(() => resolve({ canvas: null, error: "Database operation timed out" }), 5000);
      });
      
      // Race the fetch operation against the timeout
      const { canvas, error: fetchError } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (fetchError) {
        console.warn("Database fetch error:", fetchError);
        // Try to load from local storage instead
        const localData = localStorage.getItem(`usp_canvas_${strategyId}`);
        
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            if (parsedData.canvas) {
              setCanvasData(parsedData.canvas);
              toast.info("Loaded from local storage due to database error");
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error parsing local storage data:", e);
          }
        }
        
        setError(fetchError);
      } else if (canvas) {
        setCanvasData(canvas);
        
        // Also update local storage with the latest data for backup
        saveToLocalStorage(canvas);
        toast.success("Canvas data loaded successfully");
      } else {
        // No data in database, try local storage
        const localData = localStorage.getItem(`usp_canvas_${strategyId}`);
        
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            if (parsedData.canvas) {
              setCanvasData(parsedData.canvas);
              toast.info("Loaded from local storage");
            }
          } catch (e) {
            console.error("Error parsing local storage data:", e);
            setError("Failed to load canvas data from local storage");
          }
        }
      }
    } catch (err) {
      console.error("Exception in fetchCanvasData:", err);
      setError("An unexpected error occurred while loading canvas data");
      
      // Try local storage as last resort
      try {
        const localData = localStorage.getItem(`usp_canvas_${strategyId}`);
        if (localData) {
          const parsedData = JSON.parse(localData);
          if (parsedData.canvas) {
            setCanvasData(parsedData.canvas);
            toast.info("Loaded from local storage after error");
          }
        }
      } catch (e) {
        console.error("Failed to load from local storage:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the canvas data to the database with fallback to local storage
  const saveCanvasToDatabase = async (canvas: UspCanvas) => {
    if (!strategyId) return false;
    
    try {
      // First save to local storage to ensure we have a backup
      const localSuccess = saveToLocalStorage(canvas);
      
      // Create a promise that resolves after a timeout
      const timeoutPromise = new Promise<{ success: boolean, error: string | null }>((resolve) => {
        setTimeout(() => resolve({ success: false, error: "Database operation timed out" }), 5000);
      });
      
      // Race the save operation against the timeout
      const savePromise = CanvasRepository.saveCanvasData(strategyId, canvas);
      const { success, error: saveError } = await Promise.race([savePromise, timeoutPromise]);
      
      if (!success) {
        if (saveError?.includes("timed out")) {
          toast.warning("Database save timed out. Changes saved to local storage.");
        } else {
          toast.warning(saveError || "Failed to save to database. Using local storage instead.");
        }
        return localSuccess;
      }
      
      toast.success("Canvas saved successfully");
      setIsSaved(true);
      return true;
    } catch (err) {
      console.error("Exception in saveCanvasToDatabase:", err);
      toast.error("Error occurred while saving. Changes saved to local storage.");
      return false;
    }
  };

  // Save canvas wrapper that combines local and database storage
  const saveCanvas = (canvas: UspCanvas) => {
    // First save to localStorage
    const localSuccess = saveToLocalStorage(canvas);
    
    // Then save to the database if local storage was successful
    if (localSuccess) {
      saveCanvasToDatabase(canvas);
    }
    
    return localSuccess;
  };
  
  // Save final version combining local and database storage
  const saveFinalVersion = (canvas: UspCanvas) => {
    // Validate that there's content to save
    if (
      canvas.customerJobs.length === 0 &&
      canvas.customerPains.length === 0 &&
      canvas.customerGains.length === 0
    ) {
      toast.error("Cannot save final version with empty canvas. Please add content first.");
      return false;
    }
    
    // Save to localStorage with final flag
    const localSuccess = saveToLocalStorage(canvas, true);
    
    // Save to database as well if local storage was successful
    if (localSuccess) {
      saveCanvasToDatabase(canvas);
    }
    
    return localSuccess;
  };

  // Load data when component mounts or strategyId changes
  useEffect(() => {
    if (strategyId) {
      fetchCanvasData();
    }
  }, [strategyId]);

  return {
    canvasData,
    isLoading: isLoading || isLocalStorageLoading,
    error,
    fetchCanvasData,
    saveCanvasToDatabase,
    saveCanvas,
    saveFinalVersion,
    canvasSaveHistory,
    isSaved,
    setIsSaved
  };
};
