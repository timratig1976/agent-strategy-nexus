
import { useState } from 'react';
import { UspCanvas } from './types';
import { useCustomerProfile, useValueMap, useCanvasManager } from './hooks';
import { useCanvasStorage } from './hooks/useCanvasStorage';
import { useAIContentHandler } from './hooks/useAIContentHandler';
import { useRelationshipHandler } from './hooks/useRelationshipHandler';
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
  
  // Save canvas wrapper that uses the current canvas state
  const saveCanvas = () => {
    const result = storage.saveCanvas(updatedCanvas);
    return result;
  };
  
  // Save final version wrapper that uses the current canvas state
  const saveFinalVersion = () => {
    return storage.saveFinalVersion(updatedCanvas);
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
    applyAIGeneratedContent: aiContentHandler.applyAIGeneratedContent
  };
};
