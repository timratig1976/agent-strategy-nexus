
// Define interfaces for funnel data types to avoid deep recursive type issues
export interface TouchPoint {
  id: string;
  name: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
}

export interface FunnelData {
  stages: FunnelStage[];
  actionPlans?: Record<string, string>;
}

export interface FunnelStrategyModuleProps {
  strategy?: {
    id: string;
    name?: string;
  };
}

// Type guard for funnel metadata
export const isFunnelMetadata = (metadata: any): metadata is { 
  type: string; 
  is_final?: boolean | string;
} => {
  return metadata 
    && typeof metadata === 'object' 
    && metadata.type === 'funnel'
    && (metadata.is_final === undefined || 
        typeof metadata.is_final === 'boolean' || 
        metadata.is_final === 'true' || 
        metadata.is_final === 'false');
};
