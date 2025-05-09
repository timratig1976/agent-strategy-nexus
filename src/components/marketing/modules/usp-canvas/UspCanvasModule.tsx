
import React, { useEffect } from "react";
import { useUspCanvas } from "./useUspCanvas";
import { useAIResults } from "./hooks/useAIResults";
import { useNavigation } from "./hooks/useNavigation";
import UspCanvasHeader from "./components/UspCanvasHeader";
import UspCanvasModuleTabs from "./components/UspCanvasModuleTabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    applyAIGeneratedContent,
    isLoading,
    error,
    refreshCanvasData
  } = useUspCanvas(strategyId);

  const {
    storedAIResult,
    handleAddAIJobs,
    handleAddAIPains, 
    handleAddAIGains,
    handleAIResultsGenerated
  } = useAIResults(strategyId);

  const {
    hasFinalVersion,
    setHasFinalVersion,
    handleNavigateNext
  } = useNavigation(canvasSaveHistory, onNavigateNext);
  
  const handleSaveFinal = () => {
    const success = saveFinalVersion();
    if (success) {
      setHasFinalVersion(true);
      toast.success("Canvas saved as final version!");
    }
  };

  // Create wrapped handlers that use the canvas functions
  const addAIJobs = (jobs) => handleAddAIJobs(jobs, addCustomerJob);
  const addAIPains = (pains) => handleAddAIPains(pains, addCustomerPain);
  const addAIGains = (gains) => handleAddAIGains(gains, addCustomerGain);

  // Show error if there was an issue loading the canvas data
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading USP Canvas data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UspCanvasHeader 
        onNavigateBack={onNavigateBack} 
        onNavigateNext={hasFinalVersion ? handleNavigateNext : undefined}
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
        handleAddAIJobs={addAIJobs}
        handleAddAIPains={addAIPains}
        handleAddAIGains={addAIGains}
        storedAIResult={storedAIResult}
        handleAIResultsGenerated={handleAIResultsGenerated}
        canvasSaveHistory={canvasSaveHistory}
        refreshData={refreshCanvasData}
      />
    </div>
  );
};

export default UspCanvasModule;
