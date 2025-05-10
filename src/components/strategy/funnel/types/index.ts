
import { Json } from "@/integrations/supabase/types";

/**
 * Represents a touchpoint in a funnel stage
 */
export interface TouchPoint {
  id: string;
  name: string;
  channelType?: string; // Made optional to match usage in code
}

/**
 * Represents a stage in the marketing funnel
 */
export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
  keyMetrics?: string[]; // Added to fix errors in FunnelStages and FunnelVisualization
}

/**
 * Complete funnel data structure
 */
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

/**
 * Props for the FunnelStrategyModule component
 */
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
