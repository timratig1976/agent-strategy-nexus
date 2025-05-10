
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FunnelStages from "./components/FunnelStages";
import { FunnelData, FunnelStage, FunnelStrategyModuleProps, isFunnelMetadata } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  // Use lazy initialization with a function to avoid excessive type instantiation
  const [funnelData, setFunnelData] = useState<FunnelData>(() => ({
    stages: [],
    name: "",
    primaryGoal: "",
  }));
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const strategyId = strategy?.id;
  
  // Load existing funnel data if available
  useEffect(() => {
    if (!strategyId) return;
    
    const loadFunnelData = async () => {
      try {
        // Get the most recent funnel result - limiting fields to avoid deep type instantiation
        const { data, error } = await supabase
          .from('agent_results')
          .select('id, content, metadata, created_at, strategy_id, agent_id')
          .eq('strategy_id', strategyId)
          .eq('metadata->type', 'funnel')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        if (!data || data.length === 0) return;
        
        // Get the first result from the database
        const dbResult = data[0];
        
        // Check if metadata exists and has the right type
        if (dbResult.metadata && 
            typeof dbResult.metadata === 'object' &&
            'type' in dbResult.metadata &&
            dbResult.metadata.type === 'funnel' && 
            dbResult.content) {
          try {
            // Parse the content without type inference initially
            const parsedContent = JSON.parse(dbResult.content);
            
            // Validate the structure has required properties
            if (parsedContent && 
                typeof parsedContent === 'object' && 
                Array.isArray(parsedContent.stages)) {
              
              // Create a safely-typed object by cherry-picking properties
              const safeContent = {
                stages: parsedContent.stages || [],
                name: parsedContent.name || "",
                primaryGoal: parsedContent.primaryGoal || "",
                // Add other optional properties if they exist
                ...(parsedContent.leadMagnetType ? { leadMagnetType: parsedContent.leadMagnetType } : {}),
                ...(parsedContent.targetAudience ? { targetAudience: parsedContent.targetAudience } : {}),
                ...(parsedContent.mainChannel ? { mainChannel: parsedContent.mainChannel } : {}),
                ...(parsedContent.conversionAction ? { conversionAction: parsedContent.conversionAction } : {}),
                ...(parsedContent.timeframe ? { timeframe: parsedContent.timeframe } : {}),
                ...(parsedContent.budget ? { budget: parsedContent.budget } : {}),
                ...(parsedContent.kpis ? { kpis: parsedContent.kpis } : {}),
                ...(parsedContent.notes ? { notes: parsedContent.notes } : {})
              } as FunnelData;
              
              console.log("Loaded funnel data:", safeContent);
              setFunnelData(safeContent);
              setHasChanges(false);
            }
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
      // Save as an agent result
      const result = {
        strategy_id: strategyId,
        agent_id: null, // Since this is manual, no agent ID
        content: JSON.stringify(funnelData),
        metadata: {
          type: 'funnel',
          is_final: true,
          created_by: 'user'
        }
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
