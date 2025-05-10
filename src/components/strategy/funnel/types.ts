
export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  keyMetrics: string[];
  touchpoints: TouchPoint[];
}

export interface TouchPoint {
  id: string;
  name: string;
}

export interface FunnelStrategyModuleProps {
  strategyId?: string;
}

export interface FunnelData {
  stages: FunnelStage[];
  name?: string;
  primaryGoal?: string;
  leadMagnetType?: string;
  targetAudience?: string;
  mainChannel?: string;
  conversionAction?: string;
  timeframe?: string;
  budget?: string | number;
  kpis?: string;
  notes?: string;
  actionPlans?: Record<string, string>;
  conversionRates?: Record<string, number>;
  lastUpdated?: string;
  version?: number;
}

export interface FunnelMetadata {
  type: string;
  is_final: boolean | string;
  updated_at?: string;
}

// Type guard to check if metadata has the expected structure
export function isFunnelMetadata(obj: any): obj is FunnelMetadata {
  return (
    obj &&
    typeof obj === 'object' &&
    'type' in obj &&
    obj.type === 'funnel' &&
    'is_final' in obj
  );
}
