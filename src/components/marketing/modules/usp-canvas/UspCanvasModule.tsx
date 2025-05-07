import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UspCanvasOverview from "./overview/UspCanvasOverview";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import { useUspCanvas } from "./useUspCanvas";
import { Strategy } from "@/types/marketing";
import { CustomerJob, CustomerPain, CustomerGain } from './types';

interface UspCanvasModuleProps {
  strategyId: string;
  briefingContent: string;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({ strategyId, briefingContent }) => {
  const { 
    canvas,
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    addProductService,
    updateProductService,
    deleteProductService,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    isSaved,
    saveProgress,
    activeTab,
    setActiveTab,
    saveCanvas,
    resetCanvas,
    reorderCustomerJobs,
    reorderCustomerPains,
    reorderCustomerGains
  } = useUspCanvas();

  // Handle the reordering of customer jobs
  const handleReorderCustomerJobs = (reorderedJobs: CustomerJob[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs: reorderedJobs
    }));
  };

  // Handle the reordering of customer pains
  const handleReorderCustomerPains = (reorderedPains: CustomerPain[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerPains: reorderedPains
    }));
  };

  // Handle the reordering of customer gains
  const handleReorderCustomerGains = (reorderedGains: CustomerGain[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerGains: reorderedGains
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Unique Selling Proposition Canvas</h2>
      <p className="text-muted-foreground">
        Define your value proposition by mapping customer jobs, pains, and gains to your products and services.
      </p>

      <Tabs defaultValue="canvas" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="mt-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CustomerProfileCanvas 
                canvas={canvas}
                addCustomerJob={addCustomerJob}
                updateCustomerJob={updateCustomerJob}
                deleteCustomerJob={deleteCustomerJob}
                reorderCustomerJobs={handleReorderCustomerJobs}
                addCustomerPain={addCustomerPain}
                updateCustomerPain={updateCustomerPain}
                deleteCustomerPain={deleteCustomerPain}
                reorderCustomerPains={handleReorderCustomerPains}
                addCustomerGain={addCustomerGain}
                updateCustomerGain={updateCustomerGain}
                deleteCustomerGain={deleteCustomerGain}
                reorderCustomerGains={handleReorderCustomerGains}
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
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 py-4">
            <Button 
              variant="outline" 
              onClick={() => resetCanvas()}
            >
              Reset Canvas
            </Button>
            
            <Button 
              onClick={() => saveCanvas()}
              disabled={isSaved}
            >
              {isSaved ? 'Saved' : 'Save Canvas'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <UspCanvasOverview 
            canvas={canvas} 
            briefingContent={briefingContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspCanvasModule;
