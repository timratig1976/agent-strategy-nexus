
import { useState, useEffect } from 'react';
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain } from './types';
import { useCustomerProfile, useValueMap, useCanvasManager } from './hooks';
import { toast } from 'sonner';

const initialCanvas: UspCanvas = {
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  productServices: [],
  painRelievers: [],
  gainCreators: []
};

export const useUspCanvas = (strategyId?: string) => {
  const [canvas, setCanvas] = useState<UspCanvas>(initialCanvas);
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<Array<{timestamp: number, data: UspCanvas}>>([]);
  
  const customerProfile = useCustomerProfile(
    canvas.customerJobs,
    canvas.customerPains,
    canvas.customerGains
  );
  
  const valueMap = useValueMap(
    canvas.productServices,
    canvas.painRelievers,
    canvas.gainCreators
  );
  
  const canvasManager = useCanvasManager(initialCanvas, strategyId);
  
  // Load saved canvas data when the component mounts
  useEffect(() => {
    if (strategyId) {
      // Load canvas data from storage/API
      // This would be implemented with Supabase later
      const savedData = localStorage.getItem(`usp_canvas_${strategyId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setCanvas(parsedData.canvas || initialCanvas);
          setCanvasSaveHistory(parsedData.history || []);
        } catch (error) {
          console.error("Error loading saved canvas data:", error);
        }
      }
    }
  }, [strategyId]);
  
  // Synchronize the state from sub-hooks with the main canvas state
  const updatedCanvas: UspCanvas = {
    customerJobs: customerProfile.customerJobs,
    customerPains: customerProfile.customerPains,
    customerGains: customerProfile.customerGains,
    productServices: valueMap.productServices,
    painRelievers: valueMap.painRelievers,
    gainCreators: valueMap.gainCreators
  };
  
  // Update related items when deleting a customer job
  const deleteCustomerJob = (id: string) => {
    customerProfile.deleteCustomerJob(id);
    valueMap.productServices.forEach(service => {
      if (service.relatedJobIds.includes(id)) {
        valueMap.updateProductService(
          service.id, 
          service.content, 
          service.relatedJobIds.filter(jobId => jobId !== id)
        );
      }
    });
  };
  
  // Update related items when deleting a customer pain
  const deleteCustomerPain = (id: string) => {
    customerProfile.deleteCustomerPain(id);
    valueMap.painRelievers.forEach(reliever => {
      if (reliever.relatedPainIds.includes(id)) {
        valueMap.updatePainReliever(
          reliever.id,
          reliever.content,
          reliever.relatedPainIds.filter(painId => painId !== id)
        );
      }
    });
  };
  
  // Update related items when deleting a customer gain
  const deleteCustomerGain = (id: string) => {
    customerProfile.deleteCustomerGain(id);
    valueMap.gainCreators.forEach(creator => {
      if (creator.relatedGainIds.includes(id)) {
        valueMap.updateGainCreator(
          creator.id,
          creator.content,
          creator.relatedGainIds.filter(gainId => gainId !== id)
        );
      }
    });
  };

  // Reordering functions for the customer profile elements
  const reorderCustomerJobs = (reorderedJobs: CustomerJob[]) => {
    customerProfile.reorderCustomerJobs(reorderedJobs);
  };

  const reorderCustomerPains = (reorderedPains: CustomerPain[]) => {
    customerProfile.reorderCustomerPains(reorderedPains);
  };

  const reorderCustomerGains = (reorderedGains: CustomerGain[]) => {
    customerProfile.reorderCustomerGains(reorderedGains);
  };

  // Reset canvas functionality
  const resetCanvas = () => {
    if (window.confirm("Are you sure you want to reset the canvas? All your work will be lost.")) {
      setCanvas(initialCanvas);
      canvasManager.resetCanvas();
      toast.success("Canvas reset successfully");
    }
  };
  
  // Save progress to localStorage or database
  const saveProgress = (key: string, data: any) => {
    if (!strategyId) return;
    
    try {
      const storageKey = `usp_canvas_${strategyId}_${key}`;
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };
  
  // Save final version
  const saveFinalVersion = () => {
    if (!strategyId) return;
    
    try {
      // Add current state to history
      const newHistory = [...canvasSaveHistory, {
        timestamp: Date.now(),
        data: updatedCanvas
      }];
      
      // Save to localStorage
      localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
        canvas: updatedCanvas,
        history: newHistory,
        isFinal: true
      }));
      
      setCanvasSaveHistory(newHistory);
      
      // In the future, save to Supabase as well
    } catch (error) {
      console.error("Error saving final version:", error);
      toast.error("Failed to save final version");
    }
  };
  
  // Save canvas
  const saveCanvas = () => {
    if (!strategyId) return;
    
    try {
      // Add current state to history
      const newHistory = [...canvasSaveHistory, {
        timestamp: Date.now(),
        data: updatedCanvas
      }];
      
      // Save to localStorage
      localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
        canvas: updatedCanvas,
        history: newHistory
      }));
      
      setCanvasSaveHistory(newHistory);
      toast.success("Canvas saved successfully");
      
      // In the future, save to Supabase as well
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast.error("Failed to save canvas");
    }
    
    return true;
  };
  
  return {
    canvas: updatedCanvas,
    ...customerProfile,
    ...valueMap,
    ...canvasManager,
    deleteCustomerJob,
    deleteCustomerPain,
    deleteCustomerGain,
    reorderCustomerJobs,
    reorderCustomerPains,
    reorderCustomerGains,
    resetCanvas,
    saveProgress,
    saveCanvas,
    canvasSaveHistory,
    saveFinalVersion
  };
};
