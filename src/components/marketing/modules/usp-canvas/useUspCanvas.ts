
import { useState, useEffect } from 'react';
import { UspCanvas } from './types';
import { useCustomerProfile, useValueMap, useCanvasManager } from './hooks';
import { useCanvasStorage } from './hooks/useCanvasStorage';
import { useAIContentHandler } from './hooks/useAIContentHandler';
import { useRelationshipHandler } from './hooks/useRelationshipHandler';
import { useCanvasData } from './hooks/useCanvasData';
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
  
  // Use the data fetching hook
  const { 
    canvasData, 
    isLoading,
    error,
    fetchCanvasData, 
    saveCanvasToDatabase 
  } = useCanvasData(strategyId);
  
  // Use the customer profile hook for jobs, pains, and gains
  const customerProfile = useCustomerProfile(
    canvas.customerJobs,
    canvas.customerPains,
    canvas.customerGains
  );
  
  // Use the value map hook for products, relievers, and creators
  const valueMap = useValueMap(
    canvas.productServices,
    canvas.painRelievers,
    canvas.gainCreators
  );
  
  // Use the canvas manager for general canvas operations
  const canvasManager = useCanvasManager(initialCanvas);
  
  // Use the storage hook for saving and loading
  const storage = useCanvasStorage(strategyId);
  
  // Use the AI content handler hook
  const aiContentHandler = useAIContentHandler(
    customerProfile.addCustomerJob,
    customerProfile.addCustomerPain,
    customerProfile.addCustomerGain
  );
  
  // Use the relationship handler hook
  const relationshipHandler = useRelationshipHandler(
    valueMap.productServices,
    valueMap.painRelievers,
    valueMap.gainCreators,
    valueMap.updateProductService,
    valueMap.updatePainReliever,
    valueMap.updateGainCreator
  );
  
  // Set the canvas data when it loads from the database
  useEffect(() => {
    if (canvasData) {
      console.log("Setting canvas data from database:", canvasData);
      setCanvas(canvasData);
      
      // Initialize the customer profile data with the loaded data
      if (canvasData.customerJobs && canvasData.customerJobs.length > 0) {
        customerProfile.customerJobs = canvasData.customerJobs;
      }
      
      if (canvasData.customerPains && canvasData.customerPains.length > 0) {
        customerProfile.customerPains = canvasData.customerPains;
      }
      
      if (canvasData.customerGains && canvasData.customerGains.length > 0) {
        customerProfile.customerGains = canvasData.customerGains;
      }
      
      // Initialize the value map data with the loaded data
      if (canvasData.productServices && canvasData.productServices.length > 0) {
        valueMap.productServices = canvasData.productServices;
      }
      
      if (canvasData.painRelievers && canvasData.painRelievers.length > 0) {
        valueMap.painRelievers = canvasData.painRelievers;
      }
      
      if (canvasData.gainCreators && canvasData.gainCreators.length > 0) {
        valueMap.gainCreators = canvasData.gainCreators;
      }
    }
  }, [canvasData]);

  // Create enhanced delete functions that update relationships
  const deleteCustomerJob = (id: string) => {
    customerProfile.deleteCustomerJob(id);
    relationshipHandler.handleCustomerJobDeletion(id);
  };
  
  const deleteCustomerPain = (id: string) => {
    customerProfile.deleteCustomerPain(id);
    relationshipHandler.handleCustomerPainDeletion(id);
  };
  
  const deleteCustomerGain = (id: string) => {
    customerProfile.deleteCustomerGain(id);
    relationshipHandler.handleCustomerGainDeletion(id);
  };

  // Reset canvas functionality
  const resetCanvas = () => {
    if (window.confirm("Are you sure you want to reset the canvas? All your work will be lost.")) {
      setCanvas(initialCanvas);
      canvasManager.resetCanvas();
      toast.success("Canvas reset successfully");
    }
  };
  
  // Save canvas wrapper that uses the current canvas state and persists to database
  const saveCanvas = () => {
    // First save to localStorage using the existing storage hook
    const result = storage.saveCanvas(updatedCanvas);
    
    // Then save to the database
    if (result) {
      saveCanvasToDatabase(updatedCanvas);
    }
    
    return result;
  };
  
  // Save final version wrapper that uses the current canvas state
  const saveFinalVersion = () => {
    const result = storage.saveFinalVersion(updatedCanvas);
    
    // Also save to the database with final flag
    if (result) {
      saveCanvasToDatabase(updatedCanvas);
    }
    
    return result;
  };
  
  // Synchronize the state from sub-hooks with the main canvas state
  const updatedCanvas: UspCanvas = {
    customerJobs: customerProfile.customerJobs,
    customerPains: customerProfile.customerPains,
    customerGains: customerProfile.customerGains,
    productServices: valueMap.productServices,
    painRelievers: valueMap.painRelievers,
    gainCreators: valueMap.gainCreators
  };
  
  return {
    canvas: updatedCanvas,
    ...customerProfile,
    ...valueMap,
    ...canvasManager,
    ...storage,
    deleteCustomerJob,
    deleteCustomerPain,
    deleteCustomerGain,
    resetCanvas,
    saveCanvas,
    saveFinalVersion,
    applyAIGeneratedContent: aiContentHandler.applyAIGeneratedContent,
    isLoading,
    error,
    refreshCanvasData: fetchCanvasData
  };
};
