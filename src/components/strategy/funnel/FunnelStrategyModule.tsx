
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FunnelStages, 
  FunnelConfiguration, 
  FunnelVisualization, 
  FunnelAIGenerator,
  FunnelActionPlan
} from './components';
import DocumentManager from "../documents/DocumentManager";
import { 
  FunnelData, 
  FunnelStage, 
  FunnelStrategyModuleProps, 
  isFunnelMetadata 
} from "./types";

interface AgentResult {
  id: string;
  content: string;
  metadata: any;
  created_at: string;
  strategy_id: string;
  [key: string]: any;
}

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = () => {
  const { strategyId } = useParams<{ strategyId: string }>();
  const [funnelData, setFunnelData] = useState<FunnelData>({ stages: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (strategyId) {
      loadFunnelData();
    }
  }, [strategyId]);
  
  const loadFunnelData = async () => {
    try {
      setLoading(true);
      
      // Try to load existing funnel data for this strategy
      const { data: results, error } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('metadata->type', 'funnel')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (results && results.length > 0) {
        // Find the most recent final result
        const finalResult = results.find(result => {
          // Use the type guard to check if metadata has the expected structure
          return result.metadata && isFunnelMetadata(result.metadata) && 
                (result.metadata.is_final === true || result.metadata.is_final === 'true');
        });
        
        if (finalResult) {
          try {
            // Explicitly cast parsed content to FunnelData to prevent deep type instantiation
            const parsedContent = JSON.parse(finalResult.content) as FunnelData;
            setFunnelData(parsedContent);
          } catch (e) {
            console.error("Error parsing funnel data:", e);
            toast.error("Failed to parse saved funnel data");
          }
        }
      }
    } catch (err) {
      console.error("Error loading funnel data:", err);
      toast.error("Failed to load funnel data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveFunnel = async (newData: FunnelData) => {
    if (!strategyId) return;
    
    try {
      setSaving(true);
      
      // Mark existing final results as non-final
      await supabase.rpc('update_agent_results_final_status', {
        strategy_id_param: strategyId,
        result_type_param: 'funnel'
      });
      
      // Save the new funnel data
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(newData),
          metadata: {
            type: 'funnel',
            is_final: true,
            updated_at: new Date().toISOString()
          }
        });
      
      if (error) throw error;
      
      toast.success("Funnel saved successfully");
      setFunnelData(newData);
    } catch (err) {
      console.error("Error saving funnel:", err);
      toast.error("Failed to save funnel");
    } finally {
      setSaving(false);
    }
  };
  
  const handleStagesChange = (stages: FunnelStage[]) => {
    const newData = { ...funnelData, stages };
    setFunnelData(newData);
    handleSaveFunnel(newData);
  };
  
  const handleActionPlanSave = (actionPlans: Record<string, string>) => {
    const newData = { ...funnelData, actionPlans };
    setFunnelData(newData);
    handleSaveFunnel(newData);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FunnelConfiguration />
        
        <FunnelVisualization 
          funnelData={funnelData}
          isLoading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <FunnelStages 
          stages={funnelData.stages} 
          onStagesChange={handleStagesChange}
        />
        
        <FunnelActionPlan 
          stages={funnelData.stages}
          onSave={handleActionPlanSave}
          savedActionPlan={funnelData.actionPlans}
          isLoading={saving}
        />
        
        <FunnelAIGenerator 
          strategyId={strategyId || ""}
          funnelData={funnelData}
          onGenerateComplete={loadFunnelData}
        />
      </div>
      
      {strategyId && <DocumentManager strategyId={strategyId} />}
    </div>
  );
};

export default FunnelStrategyModule;
