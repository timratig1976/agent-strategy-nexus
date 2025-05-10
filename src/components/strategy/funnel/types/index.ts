
import { Json } from "@/integrations/supabase/types";

/**
 * Represents a touchpoint in a funnel stage
 */
export interface TouchPoint {
  id: string;
  name: string;
  channelType?: string;
}

/**
 * Represents a stage in the marketing funnel
 */
export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
  keyMetrics?: string[];
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

/**
 * Specific interface for funnel metadata to avoid recursive type issues
 */
export interface FunnelMetadata {
  type: 'funnel';
  is_final?: boolean | string;
  created_by?: string;
  updated_at?: string;
  version?: number;
}

/**
 * Type guard for funnel metadata
 */
export function isFunnelMetadata(metadata: unknown): metadata is FunnelMetadata {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }
  
  return (metadata as FunnelMetadata).type === 'funnel';
}
