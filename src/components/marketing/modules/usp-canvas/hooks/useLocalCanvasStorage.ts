
import { useState, useEffect } from 'react';
import { UspCanvas, CanvasHistoryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useLocalCanvasStorage = (strategyId?: string) => {
  const [canvasData, setCanvasData] = useState<UspCanvas | null>(null);
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<CanvasHistoryEntry[]>([]);
  
  // Load canvas history from localStorage
  useEffect(() => {
    if (strategyId) {
      try {
        const savedData = localStorage.getItem(`usp_canvas_${strategyId}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.canvas) {
            setCanvasData(parsedData.canvas);
          }
          if (parsedData.history) {
            setCanvasSaveHistory(parsedData.history);
          }
        }
      } catch (err) {
        console.error("Error loading saved canvas data:", err);
      }
    }
  }, [strategyId]);
  
  // Save canvas to localStorage
  const saveToLocalStorage = (canvas: UspCanvas, isFinal?: boolean) => {
    if (!strategyId) return false;
    
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
      localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
        canvas,
        history: newHistory,
        isFinal: !!isFinal
      }));
      
      // Update state
      setCanvasSaveHistory(newHistory);
      setCanvasData(canvas);
      
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };
  
  return {
    canvasData,
    canvasSaveHistory,
    saveToLocalStorage
  };
};
