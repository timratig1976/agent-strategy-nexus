
import React, { useState } from "react";
import { toast } from "sonner";
import { useUspCanvas } from "./useUspCanvas";
import { StoredAIResult } from "./types";
import UspCanvasHeader from "./components/UspCanvasHeader";
import UspCanvasModuleTabs from "./components/UspCanvasModuleTabs";

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
  const [storedAIResult, setStoredAIResult] = useState<StoredAIResult>({ jobs: [], pains: [], gains: [] });
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
    saveFinalVersion,
    applyAIGeneratedContent
  } = useUspCanvas(strategyId);

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
        addCustomerJob(job.content, job.priority || 'medium', true);
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
        addCustomerPain(pain.content, pain.severity || 'medium', true);
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
        addCustomerGain(gain.content, gain.importance || 'medium', true);
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
      <UspCanvasHeader 
        onNavigateBack={onNavigateBack} 
        onNavigateNext={onNavigateNext}
        onSaveFinal={handleSaveFinal}
      />

      <UspCanvasModuleTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        addProductService={addProductService}
        updateProductService={updateProductService}
        deleteProductService={deleteProductService}
        addPainReliever={addPainReliever}
        updatePainReliever={updatePainReliever}
        deletePainReliever={deletePainReliever}
        addGainCreator={addGainCreator}
        updateGainCreator={updateGainCreator}
        deleteGainCreator={deleteGainCreator}
        strategyId={strategyId}
        briefingContent={briefingContent}
        personaContent={personaContent}
        saveCanvas={saveCanvas}
        resetCanvas={resetCanvas}
        isSaved={isSaved}
        handleAddAIJobs={handleAddAIJobs}
        handleAddAIPains={handleAddAIPains}
        handleAddAIGains={handleAddAIGains}
        storedAIResult={storedAIResult}
        handleAIResultsGenerated={handleAIResultsGenerated}
        canvasSaveHistory={canvasSaveHistory}
      />
    </div>
  );
};

export default UspCanvasModule;
