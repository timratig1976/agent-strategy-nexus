
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UspCanvasOverview from "./UspCanvasOverview";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import { useUspCanvas } from "./useUspCanvas";
import UspCanvasAIGenerator from "./UspCanvasAIGenerator";
import { StoredAIResult } from "./types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface UspCanvasModuleProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({ 
  strategyId, 
  briefingContent,
  personaContent,
  onNavigateBack,
  onNavigateNext
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
    reorderCustomerGains,
    canvasSaveHistory,
    saveFinalVersion
  } = useUspCanvas(strategyId);

  // Handle saving AI results when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle adding AI-generated elements with duplicate prevention
  const handleAddAIJobs = (jobs) => {
    if (!jobs || jobs.length === 0) {
      toast.info("No jobs to add");
      return;
    }
    
    const newAddedIds = new Set(addedJobIds);
    const uniqueJobs = jobs.filter(job => {
      // Skip header-like items
      if (job.content.startsWith('*') || job.content.startsWith('#')) {
        return false;
      }
      
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
    
    if (uniqueJobs.length > 0) {
      uniqueJobs.forEach(job => {
        addCustomerJob(job.content, job.priority, true);
      });
      toast.success(`${uniqueJobs.length} jobs added to canvas`);
    } else {
      toast.info("All jobs have already been added");
    }
  };

  const handleAddAIPains = (pains) => {
    if (!pains || pains.length === 0) {
      toast.info("No pains to add");
      return;
    }
    
    const newAddedIds = new Set(addedPainIds);
    const uniquePains = pains.filter(pain => {
      // Skip header-like items
      if (pain.content.startsWith('*') || pain.content.startsWith('#')) {
        return false;
      }
      
      const idKey = `${pain.content}-${pain.severity}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedPainIds(newAddedIds);
    
    if (uniquePains.length > 0) {
      uniquePains.forEach(pain => {
        addCustomerPain(pain.content, pain.severity, true);
      });
      toast.success(`${uniquePains.length} pains added to canvas`);
    } else {
      toast.info("All pains have already been added");
    }
  };

  const handleAddAIGains = (gains) => {
    if (!gains || gains.length === 0) {
      toast.info("No gains to add");
      return;
    }
    
    const newAddedIds = new Set(addedGainIds);
    const uniqueGains = gains.filter(gain => {
      // Skip header-like items
      if (gain.content.startsWith('*') || gain.content.startsWith('#')) {
        return false;
      }
      
      const idKey = `${gain.content}-${gain.importance}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedGainIds(newAddedIds);
    
    if (uniqueGains.length > 0) {
      uniqueGains.forEach(gain => {
        addCustomerGain(gain.content, gain.importance, true);
      });
      toast.success(`${uniqueGains.length} gains added to canvas`);
    } else {
      toast.info("All gains have already been added");
    }
  };

  // Handle storing AI results
  const handleAIResultsGenerated = (result, debugInfo) => {
    // Filter out header-like items before storing
    const filteredResult = {
      jobs: result?.jobs?.filter(job => !job.content.startsWith('*') && !job.content.startsWith('#')) || [],
      pains: result?.pains?.filter(pain => !pain.content.startsWith('*') && !pain.content.startsWith('#')) || [],
      gains: result?.gains?.filter(gain => !gain.content.startsWith('*') && !gain.content.startsWith('#')) || [],
      debugInfo
    };
    
    setStoredAIResult(filteredResult);
    
    // Save to the database for persistence
    saveProgress('ai_results', filteredResult);
  };
  
  const handleSaveFinal = () => {
    saveFinalVersion();
    toast.success("Canvas saved as final version!");
    
    // Navigate to next stage if provided
    if (onNavigateNext) {
      setTimeout(() => {
        onNavigateNext();
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col mb-4 gap-2">
        <h2 className="text-2xl font-bold">Unique Selling Proposition Canvas</h2>
        <p className="text-muted-foreground">
          Define your value proposition by mapping customer jobs, pains, and gains to your products and services.
        </p>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-2">
          <Button 
            variant="outline" 
            onClick={onNavigateBack}
            disabled={!onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Personas
          </Button>
          
          <Button 
            onClick={handleSaveFinal}
            className="flex items-center gap-2"
          >
            Save Final Version
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="canvas" className="mt-8" onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
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
        
        <TabsContent value="history" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Canvas History</h3>
            <p className="text-muted-foreground">
              View previous versions of your canvas and restore them if needed.
            </p>
            
            <div className="space-y-4">
              {canvasSaveHistory && canvasSaveHistory.length > 0 ? (
                canvasSaveHistory.map((historyItem, index) => (
                  <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Version {canvasSaveHistory.length - index}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Implement restore functionality later
                        toast.info("Version restored");
                      }}
                    >
                      Restore
                    </Button>
                  </div>
                ))
              ) : (
                <p>No history available yet. Save your canvas to create history entries.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspCanvasModule;
