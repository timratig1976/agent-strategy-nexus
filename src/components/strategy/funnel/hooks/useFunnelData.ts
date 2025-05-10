
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
  const [funnelData, setFunnelData] = useState(() => createInitialFunnelData());
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
            const parsedContent = JSON.parse(dbResult.content);
            
            // Use the safe parsing approach instead of direct casting
            const safeContent: FunnelData = {
              stages: Array.isArray(parsedContent.stages) 
                ? parsedContent.stages.map((stage: any) => parseFunnelStage(stage))
                : [],
              name: String(parsedContent.name || ""),
              primaryGoal: String(parsedContent.primaryGoal || ""),
              leadMagnetType: String(parsedContent.leadMagnetType || ""),
              targetAudience: String(parsedContent.targetAudience || ""),
              mainChannel: String(parsedContent.mainChannel || ""),
              conversionAction: String(parsedContent.conversionAction || ""),
              timeframe: String(parsedContent.timeframe || ""),
              budget: String(parsedContent.budget || ""),
              kpis: String(parsedContent.kpis || ""),
              notes: String(parsedContent.notes || ""),
              actionPlans: (parsedContent.actionPlans ?? {}) as Record<string, string>,
              conversionRates: (parsedContent.conversionRates ?? {}) as Record<string, number>,
              lastUpdated: String(parsedContent.lastUpdated || ""),
              version: Number(parsedContent.version ?? 1),
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
