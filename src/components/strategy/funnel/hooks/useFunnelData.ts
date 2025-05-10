
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 🔒 Lokale Typen
type FunnelStage = {
  id: string;
  name: string;
  description: string;
  touchPoints: any[];
  keyMetrics?: string[];
};

type FunnelData = {
  stages: FunnelStage[];
  name: string;
  primaryGoal: string;
  leadMagnetType?: string;
  targetAudience?: string;
  mainChannel?: string;
  conversionAction?: string;
  timeframe?: string;
  budget?: string;
  kpis?: string;
  notes?: string;
  actionPlans?: Record<string, string>;
  conversionRates?: Record<string, number>;
  lastUpdated?: string;
  version?: number;
};

// ✅ Lokale Factory
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

// ✅ Typprüfung
function isFunnelMetadata(metadata: any): boolean {
  return metadata?.type === "funnel";
}

// ✅ Parser
function parseFunnelStage(stage: any): FunnelStage {
  return {
    id: String(stage.id),
    name: String(stage.name),
    description: String(stage.description),
    touchPoints: Array.isArray(stage.touchPoints) ? stage.touchPoints : [],
    keyMetrics: Array.isArray(stage.keyMetrics) ? stage.keyMetrics : [],
  };
}

// ✅ Finaler Hook
export function useFunnelData(strategyId: string | undefined) {
  // Prevent TypeScript deep instantiation by using explicit typing
  const [funnelData, setFunnelData] = useState<FunnelData>(createInitialFunnelData());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!strategyId) return;

    const loadFunnelData = async () => {
      try {
        // Using any to avoid TypeScript deep instantiation
        const response: any = await supabase
          .from("agent_results")
          .select("id, content, metadata")
          .eq("strategy_id", strategyId)
          .eq("metadata->type", "funnel")
          .order("created_at", { ascending: false })
          .limit(1);

        const data = response.data;
        const error = response.error;

        if (error) throw error;

        if (data && data.length > 0 && data[0].content) {
          const parsedContent = JSON.parse(data[0].content);

          const safeContent = {
            ...createInitialFunnelData(),
            ...parsedContent,
            stages: Array.isArray(parsedContent.stages)
              ? parsedContent.stages.map((stage: any) => parseFunnelStage(stage))
              : [],
          };

          // Use type assertion instead of generic
          setFunnelData(safeContent as FunnelData);
          setHasChanges(false);
        }
      } catch (err) {
        console.error("Error loading funnel data:", err);
        toast.error("Failed to load funnel data");
      }
    };

    loadFunnelData();
  }, [strategyId]);

  const handleStagesChange = (newStages: FunnelStage[]) => {
    setFunnelData(prev => ({
      ...prev,
      stages: newStages,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!strategyId) {
      toast.error("Strategy ID is missing");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("agent_results")
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(funnelData),
          metadata: {
            type: "funnel",
            is_final: true,
            version: funnelData.version || 1,
            created_by: "user",
            updated_at: new Date().toISOString(),
          },
        });

      if (error) throw error;

      toast.success("Funnel strategy saved successfully");
      setHasChanges(false);
    } catch (err) {
      console.error("Error saving funnel data:", err);
      toast.error("Failed to save funnel data");
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
