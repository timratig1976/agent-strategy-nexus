
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UspCanvas, StoredAIResult } from "../types";
import { CanvasHistoryEntry } from "../hooks/useCanvasDatabase";
import CanvasTab from "./tabs/CanvasTab";
import AIGenTab from "./tabs/AIGenTab";
import HistoryTab from "./tabs/HistoryTab";
import VisualizationTab from "./tabs/VisualizationTab";
import { 
  Activity, 
  BarChart2, 
  Clock, 
  FileStack, 
  Send,
  Share2
} from "lucide-react";

interface UspCanvasModuleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canvas: UspCanvas;
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
  storedAIResult: StoredAIResult | null;
  handleAIResultsGenerated: (result: any) => void;
  canvasSaveHistory: CanvasHistoryEntry[];
  refreshData: () => void;
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
  canvasSaveHistory,
  refreshData
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="visualization" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Visual Board
        </TabsTrigger>
        <TabsTrigger value="editor" className="flex items-center gap-2">
          <FileStack className="h-4 w-4" />
          Editor
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          AI Generator
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          History
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor">
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
      
      <TabsContent value="visualization">
        <VisualizationTab 
          canvas={canvas}
          onUpdateCanvas={() => saveCanvas()}
          onAddCustomerJob={addCustomerJob}
          onUpdateCustomerJob={updateCustomerJob}
          onDeleteCustomerJob={deleteCustomerJob}
          onAddCustomerPain={addCustomerPain}
          onUpdateCustomerPain={updateCustomerPain}
          onDeleteCustomerPain={deleteCustomerPain}
          onAddCustomerGain={addCustomerGain}
          onUpdateCustomerGain={updateCustomerGain}
          onDeleteCustomerGain={deleteCustomerGain}
          onAddProductService={addProductService}
          onUpdateProductService={updateProductService}
          onDeleteProductService={deleteProductService}
          onAddPainReliever={addPainReliever}
          onUpdatePainReliever={updatePainReliever}
          onDeletePainReliever={deletePainReliever}
          onAddGainCreator={addGainCreator}
          onUpdateGainCreator={updateGainCreator}
          onDeleteGainCreator={deleteGainCreator}
        />
      </TabsContent>
      
      <TabsContent value="ai">
        <AIGenTab
          strategyId={strategyId}
          briefingContent={briefingContent}
          personaContent={personaContent}
          handleAddAIJobs={handleAddAIJobs}
          handleAddAIPains={handleAddAIPains}
          handleAddAIGains={handleAddAIGains}
          storedAIResult={storedAIResult}
          onAIResultsGenerated={handleAIResultsGenerated}
        />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryTab
          canvasSaveHistory={canvasSaveHistory}
          onRefresh={refreshData}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UspCanvasModuleTabs;
