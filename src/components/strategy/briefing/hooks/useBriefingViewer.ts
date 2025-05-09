
import { useState, useCallback } from 'react';

export const useBriefingViewer = () => {
  const [showPromptMonitor, setShowPromptMonitor] = useState<boolean>(false);
  const [enhancerExpanded, setEnhancerExpanded] = useState<boolean>(false);
  
  const togglePromptMonitor = useCallback(() => {
    setShowPromptMonitor(prev => !prev);
  }, []);
  
  const toggleEnhancerExpanded = useCallback(() => {
    setEnhancerExpanded(prev => !prev);
  }, []);
  
  return {
    showPromptMonitor,
    setShowPromptMonitor,
    enhancerExpanded,
    setEnhancerExpanded,
    togglePromptMonitor,
    toggleEnhancerExpanded
  };
};
