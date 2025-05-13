
export interface FunnelStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  touchpoints?: FunnelTouchpoint[];
  keyMetrics?: string[];
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

export interface FunnelStrategyModuleProps {
  strategy: any;
}
