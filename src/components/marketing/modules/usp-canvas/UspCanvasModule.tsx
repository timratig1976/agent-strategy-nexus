
import React, { useState, useEffect } from "react";
import { LayoutDashboard, Save, RotateCcw, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUspCanvas } from "./useUspCanvas";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import UspCanvasOverview from "./UspCanvasOverview";
import UspCanvasAIGenerator from "./UspCanvasAIGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UspCanvasJob, UspCanvasPain, UspCanvasGain } from "@/services/marketingAIService";

const UspCanvasModule = () => {
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
  const [strategyId, setStrategyId] = useState<string>("");
  const [briefingContent, setBriefingContent] = useState<string>("");
  const [isLoadingBriefing, setIsLoadingBriefing] = useState<boolean>(false);
  
  // Fetch the latest strategy briefing
  useEffect(() => {
    const fetchLatestBriefing = async () => {
      try {
        setIsLoadingBriefing(true);
        // Get the latest strategy (for demo purposes - in a real app you'd use the current strategy)
        const { data: strategies, error: strategyError } = await supabase
          .from('strategies')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (strategyError) throw strategyError;
        
        if (strategies && strategies.length > 0) {
          const latestStrategyId = strategies[0].id;
          setStrategyId(latestStrategyId);
          
          // Get the latest briefing for this strategy
          const { data: results, error: resultsError } = await supabase
            .from('agent_results')
            .select('content, strategy_id')
            .eq('strategy_id', latestStrategyId)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (resultsError) throw resultsError;
          
          if (results && results.length > 0) {
            setBriefingContent(results[0].content);
          }
        }
      } catch (error) {
        console.error('Error fetching briefing:', error);
        toast.error('Failed to load strategy briefing');
      } finally {
        setIsLoadingBriefing(false);
      }
    };
    
    fetchLatestBriefing();
  }, []);

  const hasCustomerData = canvas.customerJobs.length > 0 || 
                          canvas.customerPains.length > 0 || 
                          canvas.customerGains.length > 0;
                          
  const hasValueMapData = canvas.productServices.length > 0 || 
                         canvas.painRelievers.length > 0 || 
                         canvas.gainCreators.length > 0;

  // Handle adding AI generated jobs to the canvas
  const handleAddAIJobs = (jobs: UspCanvasJob[]) => {
    jobs.forEach(job => {
      addCustomerJob(job.content, job.priority);
    });
  };
  
  // Handle adding AI generated pains to the canvas
  const handleAddAIPains = (pains: UspCanvasPain[]) => {
    pains.forEach(pain => {
      addCustomerPain(pain.content, pain.severity);
    });
  };
  
  // Handle adding AI generated gains to the canvas
  const handleAddAIGains = (gains: UspCanvasGain[]) => {
    gains.forEach(gain => {
      addCustomerGain(gain.content, gain.importance);
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
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

      {/* Save controls */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-3">
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
          {isLoadingBriefing ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading Strategy Briefing...</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={50} className="w-full" />
              </CardContent>
            </Card>
          ) : briefingContent ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Briefing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="whitespace-pre-line">{briefingContent}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <UspCanvasAIGenerator
                  strategyId={strategyId}
                  briefingContent={briefingContent}
                  onAddJobs={handleAddAIJobs}
                  onAddPains={handleAddAIPains}
                  onAddGains={handleAddAIGains}
                />
              </div>
            </div>
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
          <TabsTrigger value="customer-profile">Customer Profile</TabsTrigger>
          <TabsTrigger value="value-map">Value Map</TabsTrigger>
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
