
// Define basic type for a touchpoint in a funnel stage
export type TouchPoint = {
  id: string;
  name: string;
  channelType?: string;
};

// Define a funnel stage with touchpoints
export type FunnelStage = {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
  keyMetrics?: string[];
};

// Complete funnel data structure
export type FunnelData = {
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

// Props for the FunnelStrategyModule component
export interface FunnelStrategyModuleProps {
  strategy?: {
    id: string;
    name?: string;
  };
}

// Type guard for funnel metadata
export function isFunnelMetadata(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }
  
  return (metadata as any).type === 'funnel';
}

// Helper function to create initial funnel data state
export function createInitialFunnelData(): FunnelData {
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

// Helper function to safely parse funnel stage data
export function parseFunnelStage(rawStage: any): FunnelStage {
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
