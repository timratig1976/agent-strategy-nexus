
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UspCanvasOverview from "../UspCanvasOverview";
import CustomerProfileCanvas from "../CustomerProfileCanvas";
import ValueMapCanvas from "../ValueMapCanvas";
import UspCanvasAIGenerator from "../UspCanvasAIGenerator";
import { Button } from "@/components/ui/button";
import { StoredAIResult } from "../types";
import { toast } from "sonner";

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
  );
};

export default UspCanvasModuleTabs;
