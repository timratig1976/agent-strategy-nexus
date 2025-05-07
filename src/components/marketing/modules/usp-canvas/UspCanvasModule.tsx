
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UspCanvasOverview from "./UspCanvasOverview";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import { useUspCanvas } from "./useUspCanvas";
import UspCanvasAIGenerator from "./UspCanvasAIGenerator";
import { StoredAIResult } from "./types";

interface UspCanvasModuleProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({ 
  strategyId, 
  briefingContent,
  personaContent 
}) => {
  // Store AI results between tab switches
  const [storedAIResult, setStoredAIResult] = useState<StoredAIResult>({});
  // Track IDs of already added items to prevent duplicates
  const [addedJobIds, setAddedJobIds] = useState<Set<string>>(new Set());
  const [addedPainIds, setAddedPainIds] = useState<Set<string>>(new Set());
  const [addedGainIds, setAddedGainIds] = useState<Set<string>>(new Set());
  
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

  // Handle saving AI results when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle adding AI-generated elements with duplicate prevention
  const handleAddAIJobs = (jobs) => {
    const newAddedIds = new Set(addedJobIds);
    const uniqueJobs = jobs.filter(job => {
      // Create a unique identifier based on content and priority
      const idKey = `${job.content}-${job.priority}`;
      // Check if this combination already exists
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedJobIds(newAddedIds);
    
    uniqueJobs.forEach(job => {
      addCustomerJob(job.content, job.priority, true);
    });
  };

  const handleAddAIPains = (pains) => {
    const newAddedIds = new Set(addedPainIds);
    const uniquePains = pains.filter(pain => {
      const idKey = `${pain.content}-${pain.severity}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedPainIds(newAddedIds);
    
    uniquePains.forEach(pain => {
      addCustomerPain(pain.content, pain.severity, true);
    });
  };

  const handleAddAIGains = (gains) => {
    const newAddedIds = new Set(addedGainIds);
    const uniqueGains = gains.filter(gain => {
      const idKey = `${gain.content}-${gain.importance}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedGainIds(newAddedIds);
    
    uniqueGains.forEach(gain => {
      addCustomerGain(gain.content, gain.importance, true);
    });
  };

  // Handle storing AI results
  const handleAIResultsGenerated = (result, debugInfo) => {
    setStoredAIResult({
      jobs: result?.jobs || [],
      pains: result?.pains || [],
      gains: result?.gains || [],
      debugInfo
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Unique Selling Proposition Canvas</h2>
      <p className="text-muted-foreground">
        Define your value proposition by mapping customer jobs, pains, and gains to your products and services.
      </p>

      <Tabs defaultValue="canvas" className="mt-8" onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="mt-6 space-y-10">
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
            personaContent={personaContent}
          />
        </TabsContent>

        <TabsContent value="ai-generator" className="mt-6">
          <UspCanvasAIGenerator
            strategyId={strategyId}
            briefingContent={briefingContent}
            personaContent={personaContent}
            onAddJobs={handleAddAIJobs}
            onAddPains={handleAddAIPains}
            onAddGains={handleAddAIGains}
            storedAIResult={storedAIResult}
            onResultsGenerated={handleAIResultsGenerated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspCanvasModule;
