
import { Json } from "@/integrations/supabase/types";

/**
 * Represents a touchpoint in a funnel stage
 */
export interface TouchPoint {
  id: string;
  name: string;
}

/**
 * Represents a stage in the marketing funnel
 */
export interface FunnelStage {
  id: string;
  name: string;
  touchpoints: TouchPoint[];
}

/**
 * Complete funnel data structure
 */
export interface FunnelData {
  stages: FunnelStage[];
  actionPlans?: Record<string, string>;
}

/**
 * Represents metadata for an agent result specifically for funnel data
 */
export interface FunnelAgentResultMetadata {
  type: 'funnel';
  is_final: boolean | string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Props for the FunnelStrategyModule component
 */
export interface FunnelStrategyModuleProps {
  strategy?: any;
  onNavigateBack?: () => Promise<void>;
}

/**
 * Type guard to check if an object is a FunnelAgentResultMetadata
 */
export function isFunnelMetadata(metadata: any): metadata is FunnelAgentResultMetadata {
  return (
    metadata !== null &&
    typeof metadata === 'object' &&
    'type' in metadata &&
    metadata.type === 'funnel' &&
    'is_final' in metadata
  );
}
