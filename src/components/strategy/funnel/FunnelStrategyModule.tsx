
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FunnelStages from "./components/FunnelStages";
// Import only what we need and avoid recursive types
import { FunnelStrategyModuleProps, isFunnelMetadata } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ✅ Flacher Json-Typ zur Vermeidung von TS2589 - ganz oben nach den Imports platziert
type JsonPrimitive = string | number | boolean | null;
type LocalJson = JsonPrimitive | JsonPrimitive[] | { [key: string]: JsonPrimitive | JsonPrimitive[] };

// ✅ Lokale Definition des TouchPoint-Typs 
type TouchPoint = {
  id: string;
  name: string;
  channelType?: string;
};

// ✅ Lokale Definition des FunnelStage-Typs
type FunnelStage = {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
  keyMetrics?: string[];
};

// ✅ Lokale Definition des FunnelData-Typs
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

// ✅ Factory-Funktion: verhindert tiefe Typ-Inferenz
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
  // ✅ useState ohne explizite Typangabe – Factory liefert den Typ
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
            const parsedContent = JSON.parse(dbResult.content) as Record<string, unknown>;

            const safeContent: FunnelData = {
              stages: Array.isArray(parsedContent.stages) ? parsedContent.stages as FunnelStage[] : [],
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
      // ✅ Casting zu lokalem LocalJson-Typ verhindert Typkonflikte
      const metadata = {
        type: "funnel",
        is_final: true,
        created_by: "user",
        updated_at: new Date().toISOString(),
      } as unknown as LocalJson;

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
