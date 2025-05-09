
import { useState, useEffect } from 'react';
import { UspCanvas, CanvasHistoryEntry } from '../types';

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
      // Add current state to history
      const newHistory = [
        ...canvasSaveHistory, 
        {
          timestamp: Date.now(),
          data: canvas,
          isFinal
        }
      ];
      
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
