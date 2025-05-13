
export interface FunnelStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  touchpoints?: FunnelTouchpoint[];
}

export interface FunnelTouchpoint {
  id: string;
  name: string;
  description?: string;
  type: string;
  channel?: string;
}

export interface FunnelData {
  strategyId: string;
  stages: FunnelStage[];
}

// Re-export types from the parent directory
export * from '../types';
