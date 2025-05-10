
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Strategy } from "@/types/marketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FunnelStages,
  FunnelConfiguration,
  FunnelVisualization,
  FunnelAIGenerator,
  FunnelActionPlan
} from './components';

interface FunnelStrategyModuleProps {
  strategy: Strategy;
  onNavigateBack: () => void;
}

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({
  strategy,
  onNavigateBack
}) => {
  const [activeTab, setActiveTab] = useState<string>("stages");
  const [funnelData, setFunnelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedFunnel, setSavedFunnel] = useState<boolean>(false);
  
  // Use the agent generation hook for AI-powered funnel generation
  const {
    isGenerating,
    progress,
    generateContent,
    error,
    debugInfo
  } = useAgentGeneration({
    strategyId: strategy.id,
    module: "funnel_strategy",
    action: "generate"
  });
  
  // Load existing funnel data if available
  useEffect(() => {
    const loadFunnelData = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing funnel data in agent_results
        const { data: agentResults, error } = await supabase
          .from("agent_results")
          .select("*")
          .eq("strategy_id", strategy.id)
          .eq("metadata->>type", "funnel")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        if (agentResults && agentResults.length > 0) {
          // Parse the funnel data from the most recent result
          const latestFunnel = agentResults[0];
          try {
            const parsedFunnel = JSON.parse(latestFunnel.content);
            setFunnelData(parsedFunnel);
            setSavedFunnel(latestFunnel.metadata?.is_final === true);
          } catch (e) {
            console.error("Error parsing funnel data:", e);
            setFunnelData(null);
          }
        }
      } catch (err) {
        console.error("Error loading funnel data:", err);
        toast.error("Failed to load funnel data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFunnelData();
  }, [strategy.id]);
  
  // Function to navigate to next step (Ad Campaign Strategy)
  const handleNavigateNext = async () => {
    try {
      // Save the progress and update the strategy state
      const { error } = await supabase
        .from("strategies")
        .update({ state: "ads" })
        .eq("id", strategy.id);
        
      if (error) throw error;
      
      toast.success("Moving to Ad Campaign Strategy");
      // Wait for the database update to complete
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error("Error navigating to next step:", err);
      toast.error("Failed to move to next step");
    }
  };
  
  // Function to save funnel data
  const handleSaveFunnel = async (data: any, isFinal: boolean = false) => {
    try {
      // If this is a final version, update existing final versions
      if (isFinal) {
        await supabase.rpc('update_agent_results_final_status', {
          strategy_id_param: strategy.id,
          result_type_param: 'funnel'
        });
      }
      
      // Save the funnel data as an agent result
      const { error } = await supabase
        .from("agent_results")
        .insert({
          strategy_id: strategy.id,
          content: JSON.stringify(data),
          metadata: {
            type: "funnel",
            is_final: isFinal,
            version: funnelData?.version ? funnelData.version + 1 : 1
          }
        });
        
      if (error) throw error;
      
      setFunnelData(data);
      setSavedFunnel(isFinal);
      
      toast.success(isFinal ? "Funnel strategy saved as final version" : "Funnel strategy saved");
      
    } catch (err) {
      console.error("Error saving funnel data:", err);
      toast.error("Failed to save funnel strategy");
    }
  };
  
  // Generate a funnel using AI based on USP Canvas and Persona data
  const handleGenerateFunnel = async () => {
    try {
      // Get the USP Canvas and Persona data to use as input for the funnel generation
      const { data: uspCanvasData, error: uspError } = await supabase
        .from("agent_results")
        .select("*")
        .eq("strategy_id", strategy.id)
        .eq("metadata->>type", "usp_canvas")
        .eq("metadata->>is_final", "true")
        .single();
        
      if (uspError) {
        toast.error("USP Canvas data not found. Please complete the USP Canvas first.");
        return;
      }
      
      const { data: personaData, error: personaError } = await supabase
        .from("agent_results")
        .select("*")
        .eq("strategy_id", strategy.id)
        .eq("metadata->>type", "persona")
        .eq("metadata->>is_final", "true")
        .single();
        
      if (personaError) {
        toast.warning("Persona data not found. Funnel will be generated based only on USP Canvas.");
      }
      
      // Generate the funnel using the agent generation hook
      const result = await generateContent({
        uspCanvasData: uspCanvasData?.content,
        personaData: personaData?.content
      });
      
      if (result.error) {
        toast.error("Failed to generate funnel strategy");
        return;
      }
      
      if (result.data) {
        // Save the generated funnel data
        const funnelData = result.data.funnel || result.data;
        setFunnelData(funnelData);
        await handleSaveFunnel(funnelData);
        
        // Switch to the visualization tab to show the generated funnel
        setActiveTab("visualization");
      }
    } catch (err) {
      console.error("Error generating funnel:", err);
      toast.error("Failed to generate funnel strategy");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Funnel Strategy</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to USP Canvas
          </Button>
          
          {savedFunnel && (
            <Button 
              onClick={handleNavigateNext}
              className="flex items-center gap-2"
            >
              Continue to Ad Campaign
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Funnel Strategy Introduction */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Marketing Funnel Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            A marketing funnel visualizes the customer journey from awareness to conversion. This module helps you define each stage of your funnel, identify key touchpoints, and plan content strategies tailored to your USP and target personas.
          </p>
        </CardContent>
      </Card>
      
      {/* Tabs for different funnel strategy sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="stages">Funnel Stages</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stages" className="space-y-4">
          <FunnelStages 
            funnelData={funnelData} 
            onSaveFunnel={handleSaveFunnel}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-4">
          <FunnelConfiguration 
            funnelData={funnelData} 
            onSaveFunnel={handleSaveFunnel}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="visualization" className="space-y-4">
          <FunnelVisualization 
            funnelData={funnelData}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="ai-generator" className="space-y-4">
          <FunnelAIGenerator 
            strategyId={strategy.id}
            onGenerateFunnel={handleGenerateFunnel}
            isGenerating={isGenerating}
            progress={progress}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="action-plan" className="space-y-4">
          <FunnelActionPlan 
            funnelData={funnelData} 
            onSaveFunnel={handleSaveFunnel}
            onFinalize={() => handleSaveFunnel(funnelData, true)}
            isFinalized={savedFunnel}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunnelStrategyModule;
