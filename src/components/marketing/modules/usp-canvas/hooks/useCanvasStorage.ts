
import { useState, useEffect } from 'react';
import { UspCanvas, CanvasHistoryEntry } from '../types';
import { toast } from 'sonner';

export const useCanvasStorage = (strategyId?: string) => {
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<CanvasHistoryEntry[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load saved canvas data when the component mounts
  useEffect(() => {
    if (strategyId) {
      // Load canvas data from storage/API
      const savedData = localStorage.getItem(`usp_canvas_${strategyId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setCanvasSaveHistory(parsedData.history || []);
        } catch (error) {
          console.error("Error loading saved canvas data:", error);
        }
      }
    }
  }, [strategyId]);

  // Save progress to localStorage or database
  const saveProgress = (key: string, data: any) => {
    if (!strategyId) return;
    
    try {
      const storageKey = `usp_canvas_${strategyId}_${key}`;
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };
  
  // Save final version
  const saveFinalVersion = (canvas: UspCanvas) => {
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
      
      // Add current state to history
      const newHistory = [...canvasSaveHistory, {
        timestamp: Date.now(),
        data: canvas,
        isFinal: true
      }];
      
      // Save to localStorage
      localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
        canvas,
        history: newHistory,
        isFinal: true
      }));
      
      setCanvasSaveHistory(newHistory);
      toast.success("Final version saved successfully");
      setIsSaved(true);
      
      // In the future, save to Supabase as well
      return true;
    } catch (error) {
      console.error("Error saving final version:", error);
      toast.error("Failed to save final version");
      return false;
    }
  };
  
  // Save canvas
  const saveCanvas = (canvas: UspCanvas) => {
    if (!strategyId) return false;
    
    try {
      // Add current state to history
      const newHistory = [...canvasSaveHistory, {
        timestamp: Date.now(),
        data: canvas
      }];
      
      // Save to localStorage
      localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
        canvas,
        history: newHistory
      }));
      
      setCanvasSaveHistory(newHistory);
      toast.success("Canvas saved successfully");
      setIsSaved(true);
      
      // In the future, save to Supabase as well
      return true;
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast.error("Failed to save canvas");
      return false;
    }
  };

  return {
    canvasSaveHistory,
    isSaved,
    setIsSaved,
    saveProgress,
    saveCanvas,
    saveFinalVersion
  };
};
