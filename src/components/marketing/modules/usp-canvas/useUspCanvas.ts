
import { useState } from 'react';
import { UspCanvas } from './types';
import { useCustomerProfile, useValueMap, useCanvasManager } from './hooks';

const initialCanvas: UspCanvas = {
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  productServices: [],
  painRelievers: [],
  gainCreators: []
};

export const useUspCanvas = () => {
  const [canvas, setCanvas] = useState<UspCanvas>(initialCanvas);
  
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
  
  const canvasManager = useCanvasManager(initialCanvas);
  
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

  // Reset canvas functionality
  const resetCanvas = () => {
    setCanvas(initialCanvas);
    canvasManager.resetCanvas();
  };
  
  return {
    canvas: updatedCanvas,
    ...customerProfile,
    ...valueMap,
    ...canvasManager,
    deleteCustomerJob,
    deleteCustomerPain,
    deleteCustomerGain,
    resetCanvas
  };
};
