
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FunnelStages from "./components/FunnelStages";
import { FunnelData, FunnelStage, FunnelStrategyModuleProps, isFunnelMetadata } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  // Use lazy initialization to avoid excessive type instantiation
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
        // Get the most recent funnel result
        const { data, error } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', strategyId)
          .eq('metadata->type', 'funnel')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        if (!data || data.length === 0) return;
        
        // Map database result to AgentResult type with explicit typing
        const dbResult = data[0];
        
        // Create a safe metadata object from the database result
        const safeMetadata: Record<string, any> = 
          typeof dbResult.metadata === 'object' && dbResult.metadata !== null 
            ? dbResult.metadata as Record<string, any>
            : {};
        
        // Create the AgentResult with properly typed metadata
        const result: AgentResult = {
          id: dbResult.id,
          agentId: dbResult.agent_id,
          strategyId: dbResult.strategy_id,
          content: dbResult.content,
          createdAt: dbResult.created_at,
          metadata: safeMetadata
        };
        
        // Check if the result has valid funnel data using our improved type guard
        if (isFunnelMetadata(result.metadata) && result.content) {
          try {
            // Use type assertion to avoid deep type instantiation
            const parsedContent = JSON.parse(result.content);
            
            if (parsedContent && Array.isArray(parsedContent.stages)) {
              console.log("Loaded funnel data:", parsedContent);
              // Use type assertion to help TypeScript avoid deep analysis
              setFunnelData(parsedContent as FunnelData);
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
