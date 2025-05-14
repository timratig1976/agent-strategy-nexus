
import { useState } from 'react';

export const useBriefingViewer = () => {
  const [showPromptMonitor, setShowPromptMonitor] = useState<boolean>(false);
  const [enhancerExpanded, setEnhancerExpanded] = useState<boolean>(true);

  const togglePromptMonitor = () => {
    setShowPromptMonitor(!showPromptMonitor);
  };

  const toggleEnhancerExpanded = () => {
    setEnhancerExpanded(!enhancerExpanded);
  };

  return {
    showPromptMonitor,
    setShowPromptMonitor,
    enhancerExpanded,
    setEnhancerExpanded,
    togglePromptMonitor,
    toggleEnhancerExpanded
  };
};
