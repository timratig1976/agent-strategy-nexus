
import React from "react";
import CustomerProfileCanvas from "../../CustomerProfileCanvas";
import ValueMapCanvas from "../../ValueMapCanvas";
import { Button } from "@/components/ui/button";
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain } from "../../types";

interface CanvasTabProps {
  canvas: UspCanvas;
  addCustomerJob: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerJob: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  deleteCustomerJob: (id: string) => void;
  reorderCustomerJobs: (reorderedJobs: CustomerJob[]) => void;
  addCustomerPain: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerPain: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  deleteCustomerPain: (id: string) => void;
  reorderCustomerPains: (reorderedPains: CustomerPain[]) => void;
  addCustomerGain: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerGain: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  deleteCustomerGain: (id: string) => void;
  reorderCustomerGains: (reorderedGains: CustomerGain[]) => void;
  addProductService: (content: string, relatedJobIds: string[]) => void;
  updateProductService: (id: string, content: string, relatedJobIds: string[]) => void;
  deleteProductService: (id: string) => void;
  addPainReliever: (content: string, relatedPainIds: string[]) => void;
  updatePainReliever: (id: string, content: string, relatedPainIds: string[]) => void;
  deletePainReliever: (id: string) => void;
  addGainCreator: (content: string, relatedGainIds: string[]) => void;
  updateGainCreator: (id: string, content: string, relatedGainIds: string[]) => void;
  deleteGainCreator: (id: string) => void;
  saveCanvas: () => void;
  resetCanvas: () => void;
  isSaved: boolean;
}

const CanvasTab: React.FC<CanvasTabProps> = ({
  canvas,
  addCustomerJob,
  updateCustomerJob,
  deleteCustomerJob,
  reorderCustomerJobs,
  addCustomerPain,
  updateCustomerPain,
  deleteCustomerPain,
  reorderCustomerPains,
  addCustomerGain,
  updateCustomerGain,
  deleteCustomerGain,
  reorderCustomerGains,
  addProductService,
  updateProductService,
  deleteProductService,
  addPainReliever,
  updatePainReliever,
  deletePainReliever,
  addGainCreator,
  updateGainCreator,
  deleteGainCreator,
  saveCanvas,
  resetCanvas,
  isSaved
}) => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CustomerProfileCanvas 
            canvas={canvas}
            addCustomerJob={addCustomerJob}
            updateCustomerJob={updateCustomerJob}
            deleteCustomerJob={deleteCustomerJob}
            reorderCustomerJobs={reorderCustomerJobs}
            addCustomerPain={addCustomerPain}
            updateCustomerPain={updateCustomerPain}
            deleteCustomerPain={deleteCustomerPain}
            reorderCustomerPains={reorderCustomerPains}
            addCustomerGain={addCustomerGain}
            updateCustomerGain={updateCustomerGain}
            deleteCustomerGain={deleteCustomerGain}
            reorderCustomerGains={reorderCustomerGains}
            formPosition="top"
          />
        </div>
        
        <div className="space-y-6">
          <ValueMapCanvas 
            canvas={canvas}
            addProductService={addProductService}
            updateProductService={updateProductService}
            deleteProductService={deleteProductService}
            addPainReliever={addPainReliever}
            updatePainReliever={updatePainReliever}
            deletePainReliever={deletePainReliever}
            addGainCreator={addGainCreator}
            updateGainCreator={updateGainCreator}
            deleteGainCreator={deleteGainCreator}
            formPosition="top"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 py-4">
        <Button 
          variant="outline" 
          onClick={resetCanvas}
        >
          Reset Canvas
        </Button>
        
        <Button 
          onClick={saveCanvas}
          disabled={isSaved}
        >
          {isSaved ? 'Saved' : 'Save Canvas'}
        </Button>
      </div>
    </div>
  );
};

export default CanvasTab;
