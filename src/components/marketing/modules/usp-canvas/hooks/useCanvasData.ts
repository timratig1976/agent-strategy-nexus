
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
  const { canvasSaveHistory, saveToLocalStorage } = useLocalCanvasStorage(strategyId);

  // Fetch the canvas data from the database
  const fetchCanvasData = async () => {
    if (!strategyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from database if available
      const { canvas, error: fetchError } = await CanvasRepository.fetchCanvasData(strategyId);
      
      if (fetchError) {
        setError(fetchError);
      } else if (canvas) {
        setCanvasData(canvas);
        
        // Update local storage with the latest data
        saveToLocalStorage(canvas);
      }
    } catch (err) {
      console.error("Exception in fetchCanvasData:", err);
      setError("An unexpected error occurred while loading canvas data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the canvas data to the database
  const saveCanvasToDatabase = async (canvas: UspCanvas) => {
    if (!strategyId) return false;
    
    try {
      const { success, error: saveError } = await CanvasRepository.saveCanvasData(strategyId, canvas);
      
      if (!success) {
        toast.error(saveError || "Failed to save canvas to database");
        return false;
      }
      
      toast.success("Canvas saved to database");
      setIsSaved(true);
      return true;
    } catch (err) {
      console.error("Exception in saveCanvasToDatabase:", err);
      toast.error("An error occurred while saving canvas");
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
    fetchCanvasData();
  }, [strategyId]);

  return {
    canvasData,
    isLoading,
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
