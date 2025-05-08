
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useNavigation = (canvasSaveHistory: Array<{timestamp: number, data: any, isFinal?: boolean}>, onNavigateNext?: () => void) => {
  // Track if final version is saved
  const [hasFinalVersion, setHasFinalVersion] = useState<boolean>(false);

  // Check if we have a final version in the canvas history
  useEffect(() => {
    const hasFinal = canvasSaveHistory.some(item => item.isFinal);
    setHasFinalVersion(hasFinal);
  }, [canvasSaveHistory]);

  // Only allow navigation to next step if a final version is saved
  const handleNavigateNext = () => {
    if (!hasFinalVersion) {
      toast.error("Please save a final version before proceeding to the next step.");
      return;
    }
    
    if (onNavigateNext) {
      onNavigateNext();
    }
  };

  return {
    hasFinalVersion,
    setHasFinalVersion,
    handleNavigateNext
  };
};
