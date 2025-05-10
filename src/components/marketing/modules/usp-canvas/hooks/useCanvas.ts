
import { useState, useCallback } from 'react';
import { UspCanvas, StoredAIResult } from '../types';
import { toast } from 'sonner';

// Define initial empty canvas structure
const createEmptyCanvas = (): UspCanvas => ({
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  productServices: [],
  painRelievers: [],
  gainCreators: []
});

export const useCanvas = () => {
  const [canvas, setCanvas] = useState<UspCanvas>(createEmptyCanvas());
  const [activeTab, setActiveTab] = useState<string>("visualization");
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Reset canvas to empty state
  const resetCanvas = useCallback(() => {
    setCanvas(createEmptyCanvas());
    setIsSaved(false);
  }, []);

  // Apply AI generated content
  const applyAIGeneratedContent = useCallback((aiResult: StoredAIResult) => {
    if (!aiResult) return;

    // Create a new canvas to add AI content
    setCanvas(prevCanvas => {
      const newCanvas = { ...prevCanvas };

      // Helper function to add AI items to canvas arrays
      const addAIItems = <T extends { id: string; content: string }>(
        items: any[] | undefined,
        targetArray: T[],
        createItem: (content: string, value: string, isAI: boolean) => T
      ): T[] => {
        if (!items || items.length === 0) return targetArray;
        
        const newItems = [...targetArray];
        
        items.forEach(item => {
          if (item && (item.description || item.title)) {
            const content = item.description || item.title;
            // Find prop like priority, severity, or importance
            const valueKey = Object.keys(item).find(key => 
              ["priority", "severity", "importance"].includes(key)
            );
            const value = valueKey && item[valueKey] ? item[valueKey] : 'medium';
            
            newItems.push(createItem(content, value, true));
          }
        });
        
        return newItems;
      };

      // Add jobs
      if (aiResult.jobs && aiResult.jobs.length > 0) {
        newCanvas.customerJobs = addAIItems(
          aiResult.jobs,
          newCanvas.customerJobs,
          (content, priority, isAI) => ({
            id: `job-${Date.now()}-${Math.random()}`,
            content,
            priority: priority as 'low' | 'medium' | 'high',
            isAIGenerated: isAI
          })
        );
      }

      // Add pains
      if (aiResult.pains && aiResult.pains.length > 0) {
        newCanvas.customerPains = addAIItems(
          aiResult.pains,
          newCanvas.customerPains,
          (content, severity, isAI) => ({
            id: `pain-${Date.now()}-${Math.random()}`,
            content,
            severity: severity as 'low' | 'medium' | 'high',
            isAIGenerated: isAI
          })
        );
      }

      // Add gains
      if (aiResult.gains && aiResult.gains.length > 0) {
        newCanvas.customerGains = addAIItems(
          aiResult.gains,
          newCanvas.customerGains,
          (content, importance, isAI) => ({
            id: `gain-${Date.now()}-${Math.random()}`,
            content,
            importance: importance as 'low' | 'medium' | 'high',
            isAIGenerated: isAI
          })
        );
      }

      // If any changes were made, set as unsaved
      if (
        aiResult.jobs?.length || 
        aiResult.pains?.length || 
        aiResult.gains?.length
      ) {
        setIsSaved(false);
        toast.success("AI-generated content applied to canvas");
      }

      return newCanvas;
    });
  }, []);

  return {
    canvas,
    setCanvas,
    activeTab,
    setActiveTab,
    isSaved,
    setIsSaved,
    resetCanvas,
    applyAIGeneratedContent
  };
};
