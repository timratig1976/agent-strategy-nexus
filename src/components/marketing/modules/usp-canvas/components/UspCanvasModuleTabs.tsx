
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import UspCanvasOverview from "../UspCanvasOverview";
import { StoredAIResult } from "../types";
import { toast } from "sonner";
import { CanvasTab, AIGeneratorTab, HistoryTab, TabsList } from "./tabs";

interface UspCanvasModuleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canvas: any;
  addCustomerJob: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerJob: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  deleteCustomerJob: (id: string) => void;
  reorderCustomerJobs: (reorderedJobs: any[]) => void;
  addCustomerPain: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerPain: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  deleteCustomerPain: (id: string) => void;
  reorderCustomerPains: (reorderedPains: any[]) => void;
  addCustomerGain: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerGain: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  deleteCustomerGain: (id: string) => void;
  reorderCustomerGains: (reorderedGains: any[]) => void;
  addProductService: (content: string, relatedJobIds: string[]) => void;
  updateProductService: (id: string, content: string, relatedJobIds: string[]) => void;
  deleteProductService: (id: string) => void;
  addPainReliever: (content: string, relatedPainIds: string[]) => void;
  updatePainReliever: (id: string, content: string, relatedPainIds: string[]) => void;
  deletePainReliever: (id: string) => void;
  addGainCreator: (content: string, relatedGainIds: string[]) => void;
  updateGainCreator: (id: string, content: string, relatedGainIds: string[]) => void;
  deleteGainCreator: (id: string) => void;
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  saveCanvas: () => void;
  resetCanvas: () => void;
  isSaved: boolean;
  handleAddAIJobs: (jobs: any[]) => void;
  handleAddAIPains: (pains: any[]) => void;
  handleAddAIGains: (gains: any[]) => void;
  storedAIResult: StoredAIResult;
  handleAIResultsGenerated: (result: any, debugInfo?: any) => void;
  canvasSaveHistory: Array<{timestamp: number, data: any}>;
}

const UspCanvasModuleTabs: React.FC<UspCanvasModuleTabsProps> = ({
  activeTab,
  setActiveTab,
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
  strategyId,
  briefingContent,
  personaContent,
  saveCanvas,
  resetCanvas,
  isSaved,
  handleAddAIJobs,
  handleAddAIPains,
  handleAddAIGains,
  storedAIResult,
  handleAIResultsGenerated,
  canvasSaveHistory
}) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="canvas" className="mt-8" onValueChange={handleTabChange}>
      <TabsList activeTab={activeTab} />
      
      <TabsContent value="canvas" className="mt-6 space-y-10">
        <CanvasTab 
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
          saveCanvas={saveCanvas}
          resetCanvas={resetCanvas}
          isSaved={isSaved}
        />
      </TabsContent>

      <TabsContent value="overview" className="mt-6">
        <UspCanvasOverview 
          canvas={canvas} 
          briefingContent={briefingContent}
          personaContent={personaContent}
        />
      </TabsContent>

      <TabsContent value="ai-generator" className="mt-6">
        <AIGeneratorTab
          strategyId={strategyId}
          briefingContent={briefingContent}
          personaContent={personaContent}
          handleAddAIJobs={handleAddAIJobs}
          handleAddAIPains={handleAddAIPains}
          handleAddAIGains={handleAddAIGains}
          storedAIResult={storedAIResult}
          handleAIResultsGenerated={handleAIResultsGenerated}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-6">
        <HistoryTab canvasSaveHistory={canvasSaveHistory} />
      </TabsContent>
    </Tabs>
  );
};

export default UspCanvasModuleTabs;
