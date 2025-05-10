
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FunnelStages from "./components/FunnelStages";
import { FunnelData, FunnelStage, FunnelStrategyModuleProps, FunnelMetadata, isFunnelMetadata } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Factory function to break type recursion
function createInitialFunnelData(): FunnelData {
  return {
    stages: [],
    name: "",
    primaryGoal: "",
    leadMagnetType: "",
    targetAudience: "",
    mainChannel: "",
    conversionAction: "",
    timeframe: "",
    budget: "",
    kpis: "",
    notes: "",
    actionPlans: {},
    conversionRates: {},
    lastUpdated: "",
    version: 1,
  };
}

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  // Using lazy initializer to prevent deep type instantiation
  const [funnelData, setFunnelData] = useState<FunnelData>(() => createInitialFunnelData());
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const strategyId = strategy?.id;
  
  // Load existing funnel data if available
  useEffect(() => {
    if (!strategyId) return;
    
    const loadFunnelData = async () => {
      try {
        // Get the most recent funnel result - selecting only needed fields
        const { data, error } = await supabase
          .from('agent_results')
          .select('id, content, metadata')
          .eq('strategy_id', strategyId)
          .eq('metadata->type', 'funnel')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        if (!data || data.length === 0) return;
        
        // Get the first result from the database
        const dbResult = data[0];
        
        // Check if metadata exists and has the right type
        if (dbResult.metadata && isFunnelMetadata(dbResult.metadata)) {
          try {
            // Parse the content with explicit typing
            const parsedContent = JSON.parse(dbResult.content) as Record<string, unknown>;
            
            // Create a new properly typed FunnelData object
            const safeContent: FunnelData = {
              stages: Array.isArray(parsedContent.stages) ? parsedContent.stages : [],
              name: typeof parsedContent.name === 'string' ? parsedContent.name : "",
              primaryGoal: typeof parsedContent.primaryGoal === 'string' ? parsedContent.primaryGoal : "",
              leadMagnetType: typeof parsedContent.leadMagnetType === 'string' ? parsedContent.leadMagnetType : "",
              targetAudience: typeof parsedContent.targetAudience === 'string' ? parsedContent.targetAudience : "",
              mainChannel: typeof parsedContent.mainChannel === 'string' ? parsedContent.mainChannel : "",
              conversionAction: typeof parsedContent.conversionAction === 'string' ? parsedContent.conversionAction : "",
              timeframe: typeof parsedContent.timeframe === 'string' ? parsedContent.timeframe : "",
              budget: parsedContent.budget !== undefined ? String(parsedContent.budget) : "",
              kpis: typeof parsedContent.kpis === 'string' ? parsedContent.kpis : "",
              notes: typeof parsedContent.notes === 'string' ? parsedContent.notes : "",
              actionPlans: typeof parsedContent.actionPlans === 'object' && parsedContent.actionPlans !== null 
                ? parsedContent.actionPlans as Record<string, string> 
                : {},
              conversionRates: typeof parsedContent.conversionRates === 'object' && parsedContent.conversionRates !== null 
                ? parsedContent.conversionRates as Record<string, number> 
                : {},
              lastUpdated: typeof parsedContent.lastUpdated === 'string' ? parsedContent.lastUpdated : "",
              version: typeof parsedContent.version === 'number' ? parsedContent.version : 1,
            };
            
            console.log("Loaded funnel data:", safeContent);
            setFunnelData(safeContent);
            setHasChanges(false);
          } catch (e) {
            console.error("Failed to parse funnel content:", e);
          }
        }
      } catch (err) {
        console.error("Error loading funnel data:", err);
        toast.error("Failed to load funnel data");
      }
    };
    
    loadFunnelData();
  }, [strategyId]);
  
  // Handle stages update
  const handleStagesChange = (updatedStages: FunnelStage[]) => {
    setFunnelData(prev => ({ ...prev, stages: updatedStages }));
    setHasChanges(true);
  };
  
  // Save funnel data
  const handleSave = async () => {
    if (!strategyId) return;
    
    setIsSaving(true);
    
    try {
      // Create metadata with explicit casting to break the recursive type chain
      const metadata = {
        type: 'funnel',
        is_final: true,
        created_by: 'user',
        updated_at: new Date().toISOString()
      } as unknown as Json;
      
      // Save as an agent result
      const result = {
        strategy_id: strategyId,
        agent_id: null, // Since this is manual, no agent ID
        content: JSON.stringify(funnelData),
        metadata: metadata
      };
      
      const { error } = await supabase
        .from('agent_results')
        .insert(result);
      
      if (error) throw error;
      
      toast.success("Funnel strategy saved successfully");
      setHasChanges(false);
    } catch (err) {
      console.error("Error saving funnel data:", err);
      toast.error("Failed to save funnel strategy");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Funnel Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Define your marketing funnel stages and touchpoints for a complete customer journey.
          </p>
          
          <FunnelStages 
            stages={funnelData.stages}
            onStagesChange={handleStagesChange}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Funnel Strategy"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FunnelStrategyModule;
