
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
  // Temporarily use any type to bypass TypeScript's deep instantiation error
  const [funnelData, setFunnelData] = useState<any>({});
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
        if (!data || data.length === 0) {
          // Initialize with empty data if nothing found
          setFunnelData(createInitialFunnelData());
          return;
        }

        const dbResult = data[0];

        if (dbResult.metadata && isFunnelMetadata(dbResult.metadata)) {
          try {
            // Parse the content safely
            const rawContent = typeof dbResult.content === 'string' 
              ? JSON.parse(dbResult.content) 
              : dbResult.content;
            
            // Create a new funnel data object WITHOUT explicit type annotation
            const safeContent = {
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
              actionPlans: typeof rawContent.actionPlans === 'object' ? rawContent.actionPlans : {},
              conversionRates: typeof rawContent.conversionRates === 'object' ? rawContent.conversionRates : {},
              lastUpdated: String(rawContent.lastUpdated || ""),
              version: Number(rawContent.version || 1),
            };

            // Set without type assertion since we're using any
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

  // Initialize with default data on first render if we got an any type empty object
  useEffect(() => {
    if (Object.keys(funnelData).length === 0) {
      setFunnelData(createInitialFunnelData());
    }
  }, [funnelData]);

  return {
    funnelData,
    isSaving,
    hasChanges,
    handleStagesChange,
    handleSave,
  };
}
