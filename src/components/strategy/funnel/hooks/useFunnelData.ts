import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 🔒 Lokale Typen (nicht importiert)
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

// ✅ Typprüfung für Funnel-Metadaten
function isFunnelMetadata(metadata: any): boolean {
  return metadata?.type === "funnel";
}

// ✅ Parser für Funnel-Stages
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
  const [funnelData, setFunnelData] = useState(() => createInitialFunnelData());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!strategyId) return;

    const loadFunnelData = async () => {
      try {
        const { data, error } = (await supabase
          .from("agent_results")
          .select("id, content, metadata")
          .eq("strategy_id", strategyId)
          .eq("metadata->type", "funnel")
          .order("created_at", { ascending: false })
          .limit(1)) as any; // 💡 TS2589-Schutz: Kein Typgraph aus Supabase

        if (error) throw error;
