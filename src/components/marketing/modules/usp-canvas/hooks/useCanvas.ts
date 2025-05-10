
import { useState, useCallback, useEffect } from 'react';
import { UspCanvas, StoredAIResult, CanvasItem, CustomerJob, CustomerPain, CustomerGain } from '../types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define initial empty canvas structure
const createEmptyCanvas = (): UspCanvas => ({
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  productServices: [],
  painRelievers: [],
  gainCreators: []
});

const LOCAL_STORAGE_PREFIX = 'usp_canvas_';

export const useCanvas = (canvasId?: string) => {
  const [canvas, setCanvas] = useState<UspCanvas>(createEmptyCanvas());
  const [activeTab, setActiveTab] = useState<string>("visualization");
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [customerItems, setCustomerItems] = useState<CanvasItem[]>([]);
  const [valueItems, setValueItems] = useState<CanvasItem[]>([]);

  // Load canvas from local storage when component mounts
  useEffect(() => {
    if (!canvasId) return;
    
    const savedCanvas = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${canvasId}`);
    if (savedCanvas) {
      try {
        const parsedCanvas = JSON.parse(savedCanvas);
        setCanvas(parsedCanvas);
        
        // Convert stored canvas items to CanvasItem[] format
        const loadedCustomerItems: CanvasItem[] = [
          ...(parsedCanvas.customerJobs?.map(job => ({
            id: job.id,
            content: job.content,
            rating: job.priority,
            isAIGenerated: job.isAIGenerated
          })) || []),
          ...(parsedCanvas.customerPains?.map(pain => ({
            id: pain.id,
            content: pain.content,
            rating: pain.severity,
            isAIGenerated: pain.isAIGenerated
          })) || []),
          ...(parsedCanvas.customerGains?.map(gain => ({
            id: gain.id,
            content: gain.content,
            rating: gain.importance,
            isAIGenerated: gain.isAIGenerated
          })) || [])
        ];
        
        const loadedValueItems: CanvasItem[] = [
          ...(parsedCanvas.productServices?.map(product => ({
            id: product.id,
            content: product.content,
            rating: 'medium', // Default rating for value items
            isAIGenerated: product.isAIGenerated
          })) || []),
          ...(parsedCanvas.painRelievers?.map(reliever => ({
            id: reliever.id,
            content: reliever.content,
            rating: 'medium',
            isAIGenerated: reliever.isAIGenerated
          })) || []),
          ...(parsedCanvas.gainCreators?.map(creator => ({
            id: creator.id,
            content: creator.content,
            rating: 'medium',
            isAIGenerated: creator.isAIGenerated
          })) || [])
        ];
        
        setCustomerItems(loadedCustomerItems);
        setValueItems(loadedValueItems);
        console.log('Canvas loaded from local storage:', parsedCanvas);
      } catch (error) {
        console.error('Error parsing canvas from local storage:', error);
      }
    }
  }, [canvasId]);

  // Save canvas to local storage whenever it changes
  useEffect(() => {
    if (!canvasId || !canvas) return;
    
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${canvasId}`, JSON.stringify(canvas));
      console.log('Canvas saved to local storage:', canvas);
    } catch (error) {
      console.error('Error saving canvas to local storage:', error);
    }
  }, [canvas, canvasId]);

  // Update canvas when customer or value items change
  useEffect(() => {
    // Map CanvasItem[] back to specific types for the canvas
    const customerJobs: CustomerJob[] = customerItems
      .filter(item => item.id.startsWith('job-'))
      .map(item => ({
        id: item.id,
        content: item.content,
        priority: item.rating as 'low' | 'medium' | 'high',
        isAIGenerated: item.isAIGenerated
      }));
      
    const customerPains: CustomerPain[] = customerItems
      .filter(item => item.id.startsWith('pain-'))
      .map(item => ({
        id: item.id,
        content: item.content,
        severity: item.rating as 'low' | 'medium' | 'high',
        isAIGenerated: item.isAIGenerated
      }));
      
    const customerGains: CustomerGain[] = customerItems
      .filter(item => item.id.startsWith('gain-'))
      .map(item => ({
        id: item.id,
        content: item.content,
        importance: item.rating as 'low' | 'medium' | 'high',
        isAIGenerated: item.isAIGenerated
      }));
    
    // Update the canvas with the new items
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs,
      customerPains,
      customerGains,
      // Keep the existing value map items
      productServices: prevCanvas.productServices,
      painRelievers: prevCanvas.painRelievers,
      gainCreators: prevCanvas.gainCreators
    }));
    
    setIsSaved(false);
  }, [customerItems]);

  // Reset canvas to empty state
  const resetCanvas = useCallback(() => {
    setCanvas(createEmptyCanvas());
    setCustomerItems([]);
    setValueItems([]);
    setIsSaved(false);
  }, []);

  // Apply AI generated content with correct type prefixes
  const applyAIGeneratedContent = useCallback((aiResult: StoredAIResult) => {
    if (!aiResult) return;

    const newCustomerItems = [...customerItems];

    // Add jobs with job- prefix
    if (aiResult.jobs && aiResult.jobs.length > 0) {
      aiResult.jobs.forEach(job => {
        if (job) {
          // Get content by checking description first, then fallback to title
          const content = job.description || job.title || '';
          if (content) {
            const priority = job.priority || 'medium';
            newCustomerItems.push({
              id: `job-${uuidv4()}`, // Ensure consistent prefix for jobs
              content,
              rating: priority as 'low' | 'medium' | 'high',
              isAIGenerated: true
            });
          }
        }
      });
    }

    // Add pains with pain- prefix
    if (aiResult.pains && aiResult.pains.length > 0) {
      aiResult.pains.forEach(pain => {
        if (pain) {
          // Get content by checking description first, then fallback to title
          const content = pain.description || pain.title || '';
          if (content) {
            const severity = pain.severity || 'medium';
            newCustomerItems.push({
              id: `pain-${uuidv4()}`, // Ensure consistent prefix for pains
              content,
              rating: severity as 'low' | 'medium' | 'high',
              isAIGenerated: true
            });
          }
        }
      });
    }

    // Add gains with gain- prefix
    if (aiResult.gains && aiResult.gains.length > 0) {
      aiResult.gains.forEach(gain => {
        if (gain) {
          // Get content by checking description first, then fallback to title
          const content = gain.description || gain.title || '';
          if (content) {
            const importance = gain.importance || 'medium';
            newCustomerItems.push({
              id: `gain-${uuidv4()}`, // Ensure consistent prefix for gains
              content,
              rating: importance as 'low' | 'medium' | 'high',
              isAIGenerated: true
            });
          }
        }
      });
    }

    // Update state with new items
    setCustomerItems(newCustomerItems);
    setIsSaved(false);
    
    // Show success message if any changes were made
    const totalItems = (aiResult.jobs?.length || 0) + (aiResult.pains?.length || 0) + (aiResult.gains?.length || 0);
    if (totalItems > 0) {
      toast.success(`${totalItems} AI-generated items applied to canvas`);
    }
  }, [customerItems]);

  // Save canvas with explicit function
  const saveCanvas = useCallback(() => {
    if (!canvasId) return false;
    
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${canvasId}`, JSON.stringify(canvas));
      setIsSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving canvas:', error);
      return false;
    }
  }, [canvas, canvasId]);

  return {
    canvas,
    setCanvas,
    customerItems,
    setCustomerItems,
    valueItems,
    setValueItems,
    activeTab,
    setActiveTab,
    isSaved,
    setIsSaved,
    resetCanvas,
    applyAIGeneratedContent,
    saveCanvas
  };
};
