
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UseStrategyDebugOptions {
  defaultEnabled?: boolean;
}

interface UseStrategyDebugReturn {
  debugInfo: any;
  setDebugInfo: (info: any) => void;
  isDebugAvailable: boolean;
  isDebugEnabled: boolean;
  toggleDebugEnabled: () => void;
  clearDebugInfo: () => void;
}

/**
 * Custom hook for managing debug information in strategy flows
 */
export const useStrategyDebug = (
  options: UseStrategyDebugOptions = {}
): UseStrategyDebugReturn => {
  const { defaultEnabled = false } = options;
  
  // Store debug state in localStorage to persist across page reloads
  const [isDebugEnabled, setIsDebugEnabled] = useLocalStorage(
    'strategy-debug-enabled', 
    defaultEnabled
  );
  
  // Local debug information state
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Derived state to check if debug info is available
  const isDebugAvailable = debugInfo !== null;

  // Clear debug information
  const clearDebugInfo = useCallback(() => {
    setDebugInfo(null);
  }, []);

  // Toggle debug enabled state
  const toggleDebugEnabled = useCallback(() => {
    setIsDebugEnabled(prev => !prev);
  }, [setIsDebugEnabled]);

  // Reset debug info when enabled state changes
  useEffect(() => {
    if (!isDebugEnabled) {
      clearDebugInfo();
    }
  }, [isDebugEnabled, clearDebugInfo]);

  return {
    debugInfo,
    setDebugInfo,
    isDebugAvailable,
    isDebugEnabled,
    toggleDebugEnabled,
    clearDebugInfo
  };
};
