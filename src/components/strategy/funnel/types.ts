
import { Strategy } from "@/types/marketing";

export interface FunnelStrategyModuleProps {
  strategy: Strategy;
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchPoints: FunnelTouchpoint[];
  keyMetrics?: string[];
}

export interface FunnelTouchpoint {
  id: string;
  name: string;
  description: string;
  channel: string;
}

// For backward compatibility
export type TouchPoint = FunnelTouchpoint;

export interface FunnelData {
  id?: string;
  strategyId: string;
  stages: FunnelStage[];
}
