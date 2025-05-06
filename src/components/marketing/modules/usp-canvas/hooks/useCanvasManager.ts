
import { useState } from 'react';
import { UspCanvas } from '../types';

export const useCanvasManager = (initialCanvas: UspCanvas) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("customer-profile");

  // Canvas management
  const saveCanvas = async () => {
    setIsSaved(false);
    setSaveProgress(0);
    
    // Simulate saving process with progress
    const intervalId = setInterval(() => {
      setSaveProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setIsSaved(true);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const resetCanvas = () => {
    setIsSaved(false);
    return initialCanvas;
  };

  return {
    isSaved,
    saveProgress,
    activeTab,
    setActiveTab,
    saveCanvas,
    resetCanvas
  };
};
