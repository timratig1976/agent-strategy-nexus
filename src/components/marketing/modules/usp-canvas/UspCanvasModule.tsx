
import React, { useState, useEffect } from "react";
import { LayoutDashboard, Save, RotateCcw, Bot, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUspCanvas } from "./useUspCanvas";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import UspCanvasOverview from "./UspCanvasOverview";
import UspCanvasAIGenerator from "./UspCanvasAIGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { UspCanvasJob, UspCanvasPain, UspCanvasGain } from "@/services/marketingAIService";
import { AlertCircle } from "lucide-react";

interface UspCanvasModuleProps {
  strategyId?: string;
  briefingContent?: string;
}

const UspCanvasModule: React.FC<UspCanvasModuleProps> = ({ 
  strategyId = "", 
  briefingContent = "" 
}) => {
  const {
    canvas,
    activeTab,
    setActiveTab,
    isSaved,
    saveProgress,
    // Customer Profile
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    // Value Map
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    // Canvas management
    saveCanvas,
    resetCanvas
  } = useUspCanvas();

  const [showAiGenerator, setShowAiGenerator] = useState<boolean>(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState<boolean>(true);
  const [aiMode, setAiMode] = useState<"extend" | "replace">("extend");
  const [isLoadingBriefing, setIsLoadingBriefing] = useState<boolean>(false);
  
  // Use the provided briefing content and strategy ID if available
  const hasProvidedStrategy = !!strategyId && !!briefingContent;

  const hasCustomerData = canvas.customerJobs.length > 0 || 
                         canvas.customerPains.length > 0 || 
                         canvas.customerGains.length > 0;
                          
  const hasValueMapData = canvas.productServices.length > 0 || 
                         canvas.painRelievers.length > 0 || 
                         canvas.gainCreators.length > 0;

  // Handle adding AI generated jobs to the canvas
  const handleAddAIJobs = (jobs: UspCanvasJob[]) => {
    if (aiMode === "extend") {
      // Add new items without removing existing ones
      jobs.forEach(job => {
        // Check for duplicates based on content similarity
        const isDuplicate = canvas.customerJobs.some(
          existingJob => existingJob.content.toLowerCase().trim() === job.content.toLowerCase().trim()
        );
        
        if (!isDuplicate) {
          addCustomerJob(job.content, job.priority);
        }
      });
      
      toast.success(`Added ${jobs.length} new customer jobs to canvas`);
    } else {
      // Replace mode - clear existing jobs first
      canvas.customerJobs.forEach(job => {
        deleteCustomerJob(job.id);
      });
      
      // Then add the new ones
      jobs.forEach(job => {
        addCustomerJob(job.content, job.priority);
      });
      
      toast.success(`Replaced customer jobs with ${jobs.length} new items`);
    }
  };
  
  // Handle adding AI generated pains to the canvas
  const handleAddAIPains = (pains: UspCanvasPain[]) => {
    if (aiMode === "extend") {
      // Add new items without removing existing ones
      pains.forEach(pain => {
        // Check for duplicates
        const isDuplicate = canvas.customerPains.some(
          existingPain => existingPain.content.toLowerCase().trim() === pain.content.toLowerCase().trim()
        );
        
        if (!isDuplicate) {
          addCustomerPain(pain.content, pain.severity);
        }
      });
      
      toast.success(`Added new customer pains to canvas`);
    } else {
      // Replace mode - clear existing pains first
      canvas.customerPains.forEach(pain => {
        deleteCustomerPain(pain.id);
      });
      
      // Then add the new ones
      pains.forEach(pain => {
        addCustomerPain(pain.content, pain.severity);
      });
      
      toast.success(`Replaced customer pains with ${pains.length} new items`);
    }
  };
  
  // Handle adding AI generated gains to the canvas
  const handleAddAIGains = (gains: UspCanvasGain[]) => {
    if (aiMode === "extend") {
      // Add new items without removing existing ones
      gains.forEach(gain => {
        // Check for duplicates
        const isDuplicate = canvas.customerGains.some(
          existingGain => existingGain.content.toLowerCase().trim() === gain.content.toLowerCase().trim()
        );
        
        if (!isDuplicate) {
          addCustomerGain(gain.content, gain.importance);
        }
      });
      
      toast.success(`Added new customer gains to canvas`);
    } else {
      // Replace mode - clear existing gains first
      canvas.customerGains.forEach(gain => {
        deleteCustomerGain(gain.id);
      });
      
      // Then add the new ones
      gains.forEach(gain => {
        addCustomerGain(gain.content, gain.importance);
      });
      
      toast.success(`Replaced customer gains with ${gains.length} new items`);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">USP Canvas Builder</h2>
          <p className="text-muted-foreground mt-1">
            Build a unique selling proposition canvas using the Value Proposition Canvas methodology
          </p>
        </div>
      </div>

      {/* User guidance panel */}
      <Collapsible
        open={isGuidanceOpen}
        onOpenChange={setIsGuidanceOpen}
        className="mb-6 border rounded-md bg-slate-50"
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">How to use the USP Canvas</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isGuidanceOpen ? "Hide" : "Show"} Guidance
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-2 text-sm">
            <p className="mb-2">
              You have two ways to build your unique selling proposition canvas:
            </p>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 border rounded-md p-3 bg-white">
                <h4 className="font-semibold flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800">1</span> 
                  Manual Creation
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Add and edit each element yourself by filling in the forms in each section.
                </p>
                <p className="text-xs mt-2 text-blue-600">
                  Best for full customization and specific industry knowledge
                </p>
              </div>
              <div className="flex-1 border rounded-md p-3 bg-white">
                <h4 className="font-semibold flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800">2</span>
                  AI Generation
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Use our AI to generate elements based on your strategy briefing.
                </p>
                <p className="text-xs mt-2 text-blue-600">
                  Best for quickly populating your canvas with smart suggestions
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-blue-800 text-sm font-medium">Pro Tips</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-blue-700 text-xs">
                <li>Use the AI generator to create a foundation, then refine manually</li>
                <li>In the "Add to existing" mode, the AI will avoid duplicates</li>
                <li>Elements are color-coded by priority/severity/importance</li>
                <li>Connect your products to customer jobs, pains, and gains in Value Map</li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Save controls */}
      <div className="mb-8 flex flex-wrap gap-y-4 justify-between items-center">
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={saveCanvas}
            disabled={isSaved || saveProgress > 0}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Canvas</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={resetCanvas}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button
            variant={showAiGenerator ? "default" : "outline"}
            onClick={() => setShowAiGenerator(!showAiGenerator)}
            className="flex items-center space-x-2"
          >
            <Bot className="h-4 w-4" />
            <span>{showAiGenerator ? "Hide AI Generator" : "Show AI Generator"}</span>
          </Button>
        </div>
        
        {saveProgress > 0 && !isSaved && (
          <div className="flex items-center space-x-3 w-64">
            <Progress value={saveProgress} className="w-full" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{saveProgress}%</span>
          </div>
        )}
        
        {isSaved && (
          <div className="text-sm text-green-600">
            Canvas saved successfully!
          </div>
        )}
      </div>

      {/* AI Generator Panel */}
      {showAiGenerator && (
        <div className="mb-8">
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">AI Generation Mode</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm"
                    variant={aiMode === "extend" ? "default" : "outline"}
                    onClick={() => setAiMode("extend")}
                  >
                    Add to existing
                  </Button>
                  <Button
                    size="sm"
                    variant={aiMode === "replace" ? "default" : "outline"}
                    onClick={() => setAiMode("replace")}
                  >
                    Replace existing
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {aiMode === "extend" ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>New AI-generated elements will be added to your existing content, avoiding duplicates</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Warning: This will replace your existing elements with new AI-generated ones</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {(hasProvidedStrategy || (strategyId && briefingContent)) ? (
            <UspCanvasAIGenerator
              strategyId={strategyId}
              briefingContent={briefingContent}
              onAddJobs={handleAddAIJobs}
              onAddPains={handleAddAIPains}
              onAddGains={handleAddAIGains}
            />
          ) : isLoadingBriefing ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading Strategy Briefing...</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={50} className="w-full" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Strategy Briefing Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To use the AI generator, you need to have a strategy briefing. 
                  Please create a strategy and complete the briefing stage first.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="customer-profile">
            Customer Profile {hasCustomerData && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">{canvas.customerJobs.length + canvas.customerPains.length + canvas.customerGains.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="value-map">
            Value Map {hasValueMapData && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">{canvas.productServices.length + canvas.painRelievers.length + canvas.gainCreators.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="overview" disabled={!hasCustomerData && !hasValueMapData}>
            Canvas Overview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer-profile" className="mt-6">
          <CustomerProfileCanvas
            canvas={canvas}
            addCustomerJob={addCustomerJob}
            updateCustomerJob={updateCustomerJob}
            deleteCustomerJob={deleteCustomerJob}
            addCustomerPain={addCustomerPain}
            updateCustomerPain={updateCustomerPain}
            deleteCustomerPain={deleteCustomerPain}
            addCustomerGain={addCustomerGain}
            updateCustomerGain={updateCustomerGain}
            deleteCustomerGain={deleteCustomerGain}
          />
        </TabsContent>
        
        <TabsContent value="value-map" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="overview" className="mt-6">
          <UspCanvasOverview canvas={canvas} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspCanvasModule;
