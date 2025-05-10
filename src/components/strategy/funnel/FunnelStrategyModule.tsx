
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FunnelStages from "./components/FunnelStages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ✅ Definition of local types to avoid recursive type problems
// Define simple local types that don't reference complex JSON types
type TouchPoint = {
  id: string;
  name: string;
  channelType?: string;
};

type FunnelStage = {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
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

// ✅ Local definition of the props type
type FunnelStrategyModuleProps = {
  strategy?: {
    id: string;
    name?: string;
  };
};

// ✅ Helper function to safely parse funnel stage data
function parseFunnelStage(rawStage: any): FunnelStage {
  return {
    id: String(rawStage.id || ''),
    name: String(rawStage.name || ''),
    description: String(rawStage.description || ''),
    touchPoints: Array.isArray(rawStage.touchPoints) 
      ? rawStage.touchPoints.map((tp: any) => ({
          id: String(tp.id || ''),
          name: String(tp.name || ''),
          channelType: String(tp.channelType || '')
        }))
      : [],
    keyMetrics: Array.isArray(rawStage.keyMetrics) 
      ? rawStage.keyMetrics.map(String)
      : []
  };
}

// ✅ Helper function to create a safe initial state
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

// Helper to check if metadata is funnel type
function isFunnelMetadata(meta: any): boolean {
  return meta?.type === "funnel";
}

// Define a simple JSON type for supabase interactions
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  const [funnelData, setFunnelData] = useState(() => createInitialFunnelData());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const strategyId = strategy?.id;

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
            
            // ✅ Use the safe parsing approach instead of direct casting
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

  const handleStagesChange = (updatedStages: FunnelStage[]) => {
    setFunnelData(prev => ({ ...prev, stages: updatedStages }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!strategyId) return;
    setIsSaving(true);

    try {
      const metadata = {
        type: "funnel",
        is_final: true,
        created_by: "user",
        updated_at: new Date().toISOString(),
      } as JsonValue;

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
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? "Saving..." : "Save Funnel Strategy"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FunnelStrategyModule;
