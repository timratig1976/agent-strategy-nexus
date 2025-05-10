
import { useState, useEffect } from 'react';
import { UspCanvas, CanvasHistoryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useLocalCanvasStorage = (strategyId?: string) => {
  const [canvasData, setCanvasData] = useState<UspCanvas | null>(null);
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<CanvasHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Generate a consistent storage key
  const getStorageKey = () => {
    if (!strategyId) return null;
    return `usp_canvas_${strategyId}`;
  };
  
  // Load canvas history from localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Handle backward compatibility with older formats
        if (parsedData.canvas) {
          setCanvasData(parsedData.canvas);
        } else if (typeof parsedData === 'object' && 'customerJobs' in parsedData) {
          setCanvasData(parsedData);
        }
        
        // Load history if available
        if (parsedData.history && Array.isArray(parsedData.history)) {
          setCanvasSaveHistory(parsedData.history);
        } else {
          setCanvasSaveHistory([]);
        }
        
        console.log("Loaded canvas data from localStorage:", parsedData);
      }
    } catch (err) {
      console.error("Error loading saved canvas data:", err);
      setLoadError("Failed to load canvas data from local storage");
    } finally {
      setIsLoading(false);
    }
  }, [strategyId]);
  
  // Save canvas to localStorage
  const saveToLocalStorage = (canvas: UspCanvas, isFinal?: boolean) => {
    const storageKey = getStorageKey();
    if (!storageKey) return false;
    
    try {
      // Add current state to history with proper type
      const newHistoryEntry: CanvasHistoryEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        data: canvas,
        isFinal: !!isFinal,
        metadata: { source: 'local-storage' }
      };
      
      const newHistory: CanvasHistoryEntry[] = [...canvasSaveHistory, newHistoryEntry];
      
      // Save to localStorage
      const dataToSave = {
        canvas,
        history: newHistory,
        isFinal: !!isFinal,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log("Canvas saved to localStorage:", dataToSave);
      
      // Update state
      setCanvasSaveHistory(newHistory);
      setCanvasData(canvas);
      
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };
  
  // Clear canvas data from localStorage
  const clearLocalStorage = () => {
    const storageKey = getStorageKey();
    if (!storageKey) return false;
    
    try {
      localStorage.removeItem(storageKey);
      setCanvasData(null);
      setCanvasSaveHistory([]);
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  };
  
  return {
    canvasData,
    canvasSaveHistory,
    isLoading,
    loadError,
    saveToLocalStorage,
    clearLocalStorage
  };
};
