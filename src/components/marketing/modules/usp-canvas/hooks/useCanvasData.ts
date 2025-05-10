
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
  const { 
    canvasSaveHistory, 
    saveToLocalStorage, 
    loadError: localStorageError 
  } = useLocalCanvasStorage(strategyId);
  
  // Effect to handle local storage errors
  useEffect(() => {
    if (localStorageError) {
      console.warn("Local storage error:", localStorageError);
      // Don't show toast for this, just log it
    }
  }, [localStorageError]);

  // Fetch the canvas data from the database
  const fetchCanvasData = async () => {
    if (!strategyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching canvas data for strategy:", strategyId);
      
      // Try to fetch from database if available
      const { canvas, error: fetchError } = await CanvasRepository.fetchCanvasData(strategyId);
      
      if (fetchError) {
        console.error("Error fetching canvas:", fetchError);
        setError(fetchError);
        toast.error("Failed to load canvas from database, using local data if available");
      } 
      
      if (canvas) {
        console.log("Canvas fetched successfully:", canvas);
        setCanvasData(canvas);
        
        // Update local storage with the latest data
        saveToLocalStorage(canvas);
        setIsSaved(true);
      } else {
        console.log("No canvas found in database, checking local storage");
      }
    } catch (err) {
      console.error("Exception in fetchCanvasData:", err);
      setError("An unexpected error occurred while loading canvas data");
      toast.error("Failed to load canvas data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the canvas data to the database
  const saveCanvasToDatabase = async (canvas: UspCanvas) => {
    if (!strategyId) return false;
    
    try {
      console.log("Saving canvas to database:", canvas);
      const { success, error: saveError } = await CanvasRepository.saveCanvasData(strategyId, canvas);
      
      if (!success) {
        console.error("Error saving canvas to database:", saveError);
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
  const saveCanvas = async (canvas: UspCanvas) => {
    setCanvasData(canvas); // Update local state immediately
    
    // First save to localStorage
    const localSuccess = saveToLocalStorage(canvas);
    if (!localSuccess) {
      toast.error("Failed to save canvas to local storage");
    }
    
    // Then save to the database if local storage was successful
    if (localSuccess) {
      return await saveCanvasToDatabase(canvas);
    }
    
    return false;
  };
  
  // Save final version combining local and database storage
  const saveFinalVersion = async (canvas: UspCanvas) => {
    // Validate that there's content to save
    if (
      !canvas || 
      (canvas.customerJobs.length === 0 &&
      canvas.customerPains.length === 0 &&
      canvas.customerGains.length === 0)
    ) {
      toast.error("Cannot save final version with empty canvas. Please add content first.");
      return false;
    }
    
    // Save to localStorage with final flag
    const localSuccess = saveToLocalStorage(canvas, true);
    if (!localSuccess) {
      toast.error("Failed to save canvas to local storage");
    }
    
    // Update local state
    setCanvasData(canvas);
    
    // Save to database as well if local storage was successful
    if (localSuccess) {
      return await saveCanvasToDatabase(canvas);
    }
    
    return false;
  };

  // Load data when component mounts or strategyId changes
  useEffect(() => {
    if (strategyId) {
      fetchCanvasData();
    }
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
    setIsSaved,
    setCanvasData
  };
};
