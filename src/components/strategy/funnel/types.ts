
import { Strategy } from "@/types/marketing";

export interface FunnelStrategyModuleProps {
  strategy: Strategy;
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchpoints: FunnelTouchpoint[];
}

export interface FunnelTouchpoint {
  id: string;
  name: string;
  description: string;
  channel: string;
}

export interface FunnelData {
  id?: string;
  strategyId: string;
  stages: FunnelStage[];
}
