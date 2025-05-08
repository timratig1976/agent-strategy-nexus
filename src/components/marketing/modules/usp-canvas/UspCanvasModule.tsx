import React, { useState, useEffect } from "react";
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
  prevStageLabel?: string;
  nextStageLabel?: string;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({ 
  strategyId, 
  briefingContent,
  personaContent,
  onNavigateBack,
  onNavigateNext,
  prevStageLabel,
  nextStageLabel
}) => {
  // Store AI results between tab switches
  const [storedAIResult, setStoredAIResult] = useState<StoredAIResult>({ jobs: [], pains: [], gains: [] });
  // Track IDs of already added items to prevent duplicates
  const [addedJobIds, setAddedJobIds] = useState<Set<string>>(new Set());
  const [addedPainIds, setAddedPainIds] = useState<Set<string>>(new Set());
  const [addedGainIds, setAddedGainIds] = useState<Set<string>>(new Set());
  // Track if final version is saved
  const [hasFinalVersion, setHasFinalVersion] = useState<boolean>(false);
  
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

  // Load stored AI results on component mount
  useEffect(() => {
    if (strategyId) {
      try {
        const savedResultsKey = `usp_canvas_${strategyId}_ai_results`;
        const savedResults = localStorage.getItem(savedResultsKey);
        
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          if (parsedResults.data) {
            console.log('Loading stored AI results on module mount:', parsedResults.data);
            setStoredAIResult(parsedResults.data);
          }
        }
      } catch (error) {
        console.error('Error loading saved AI results on mount:', error);
      }
    }
  }, [strategyId]);

  // Check if we have a final version in the canvas history
  useEffect(() => {
    const hasFinal = canvasSaveHistory.some(item => item.isFinal);
    setHasFinalVersion(hasFinal);
  }, [canvasSaveHistory]);

  // Handle adding AI-generated elements with duplicate prevention and better uniqueness checking
  const handleAddAIJobs = (jobs) => {
    if (!jobs || jobs.length === 0) {
      toast.info("No jobs to add");
      return;
    }
    
    const newAddedIds = new Set(addedJobIds);
    const uniqueJobs = jobs.filter(job => {
      // Skip invalid items
      if (!job || !job.content || typeof job.content !== 'string') {
        return false;
      }
      
      const content = job.content.trim();
      if (!content) return false;
      
      // Create a unique identifier based on content and priority
      const idKey = `${content}-${job.priority}`;
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
      toast.success(`Added ${uniqueJobs.length} jobs to canvas`);
    } else {
      toast.info("All jobs have already been added");
    }
  };

  // Similar improvements for pains and gains handlers
  const handleAddAIPains = (pains) => {
    if (!pains || pains.length === 0) {
      toast.info("No pains to add");
      return;
    }
    
    const newAddedIds = new Set(addedPainIds);
    const uniquePains = pains.filter(pain => {
      // Skip invalid items
      if (!pain || !pain.content || typeof pain.content !== 'string') {
        return false;
      }
      
      const content = pain.content.trim();
      if (!content) return false;
      
      const idKey = `${content}-${pain.severity}`;
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
      toast.success(`Added ${uniquePains.length} pains to canvas`);
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
      // Skip invalid items
      if (!gain || !gain.content || typeof gain.content !== 'string') {
        return false;
      }
      
      const content = gain.content.trim();
      if (!content) return false;
      
      const idKey = `${content}-${gain.importance}`;
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
      toast.success(`Added ${uniqueGains.length} gains to canvas`);
    } else {
      toast.info("All gains have already been added");
    }
  };

  // Handle storing AI results with more robust error handling
  const handleAIResultsGenerated = (result, debugInfo) => {
    console.log('AI results generated callback received:', result);
    
    // Validate result structure before storing
    if (!result) {
      console.error('Empty result received in handleAIResultsGenerated');
      return;
    }
    
    // Ensure all arrays exist
    const validatedResult: StoredAIResult = {
      jobs: Array.isArray(result.jobs) ? result.jobs : [],
      pains: Array.isArray(result.pains) ? result.pains : [],
      gains: Array.isArray(result.gains) ? result.gains : []
    };
    
    // Store the validated result
    setStoredAIResult(validatedResult);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem(
        `usp_canvas_${strategyId}_ai_results`, 
        JSON.stringify({ data: validatedResult, debugInfo, timestamp: Date.now() })
      );
    } catch (err) {
      console.error('Error saving AI results in handleAIResultsGenerated:', err);
    }
  };
  
  const handleSaveFinal = () => {
    const success = saveFinalVersion();
    if (success) {
      setHasFinalVersion(true);
      toast.success("Canvas saved as final version!");
    }
  };

  // Only allow navigation to next step if a final version is saved
  const handleNavigateNext = () => {
    if (!hasFinalVersion) {
      toast.error("Please save a final version before proceeding to the next step.");
      return;
    }
    
    if (onNavigateNext) {
      onNavigateNext();
    }
  };

  return (
    <div className="w-full">
      <UspCanvasHeader 
        onNavigateBack={onNavigateBack} 
        onNavigateNext={hasFinalVersion ? onNavigateNext : undefined}
        onSaveFinal={handleSaveFinal}
        isFinalSaved={hasFinalVersion}
        prevStageLabel={prevStageLabel}
        nextStageLabel={nextStageLabel}
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
