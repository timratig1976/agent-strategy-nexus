
// Define types for the funnel strategy module

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchPoints?: TouchPoint[];
}

export interface TouchPoint {
  id: string;
  name: string;
  stageId: string;
  channelType: string;
}

export interface FunnelData {
  stages: FunnelStage[];
  actionPlans?: Record<string, string>;
}

export interface FunnelMetadata {
  type: string;
  is_final: boolean | string;
  updated_at?: string;
}

export interface FunnelStrategyModuleProps {
  strategy?: any;
  onNavigateBack?: () => void;
}

// Type guard for checking if an object matches the FunnelMetadata interface
export function isFunnelMetadata(obj: any): obj is FunnelMetadata {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    obj.type === 'funnel' &&
    'is_final' in obj
  );
}
