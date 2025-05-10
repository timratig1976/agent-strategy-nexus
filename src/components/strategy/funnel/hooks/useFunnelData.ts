
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FunnelData, 
  FunnelStage, 
  isFunnelMetadata, 
  createInitialFunnelData,
  parseFunnelStage
} from "../types";

export function useFunnelData(strategyId: string | undefined) {
  const [funnelData, setFunnelData] = useState<FunnelData>(() => createInitialFunnelData());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load funnel data
  useEffect(() => {
    if (!strategyId) return;

    const loadFunnelData = async () => {
      try {
        const { data, error } = await supabase
          .from("agent_results")
          .select("id, content, metadata")
          .eq("strategy_id", strategyId)
          .eq("metadata->type", "funnel")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;
        if (!data || data.length === 0) return;

        const dbResult = data[0];

        if (dbResult.metadata && isFunnelMetadata(dbResult.metadata)) {
          try {
            // Parse the content safely - this was causing the deep instantiation issue
            const rawContent = JSON.parse(dbResult.content);
            
            // Create a new funnel data object manually instead of using type casting
            const safeContent: FunnelData = {
              stages: Array.isArray(rawContent.stages) 
                ? rawContent.stages.map((stage: any) => parseFunnelStage(stage))
                : [],
              name: String(rawContent.name || ""),
              primaryGoal: String(rawContent.primaryGoal || ""),
              leadMagnetType: String(rawContent.leadMagnetType || ""),
              targetAudience: String(rawContent.targetAudience || ""),
              mainChannel: String(rawContent.mainChannel || ""),
              conversionAction: String(rawContent.conversionAction || ""),
              timeframe: String(rawContent.timeframe || ""),
              budget: String(rawContent.budget || ""),
              kpis: String(rawContent.kpis || ""),
              notes: String(rawContent.notes || ""),
              actionPlans: rawContent.actionPlans || {},
              conversionRates: rawContent.conversionRates || {},
              lastUpdated: String(rawContent.lastUpdated || ""),
              version: Number(rawContent.version || 1),
            };

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

  // Handle stages change
  const handleStagesChange = (updatedStages: FunnelStage[]) => {
    setFunnelData(prev => ({ ...prev, stages: updatedStages }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!strategyId) return;
    setIsSaving(true);

    try {
      const metadata = {
        type: "funnel",
        is_final: true,
        created_by: "user",
        updated_at: new Date().toISOString(),
      };

      const result = {
        strategy_id: strategyId,
        agent_id: null,
        content: JSON.stringify(funnelData),
        metadata,
      };

      const { error } = await supabase.from("agent_results").insert(result);

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

  return {
    funnelData,
    isSaving,
    hasChanges,
    handleStagesChange,
    handleSave,
  };
}
