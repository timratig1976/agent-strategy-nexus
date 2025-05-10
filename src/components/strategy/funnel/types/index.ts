
import { Json } from "@/integrations/supabase/types";

/**
 * Represents a touchpoint in a funnel stage
 */
export interface TouchPoint {
  id: string;
  name: string;
  stageId: string;
  channelType: string;
}

/**
 * Represents a stage in the marketing funnel
 */
export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  keyMetrics: string[];
  touchPoints: TouchPoint[];
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
 * Metadata for funnel agent results
 */
export interface FunnelMetadata {
  type: string;
  is_final: boolean | string;
  updated_at?: string;
}

/**
 * Props for the FunnelStrategyModule component
 */
export interface FunnelStrategyModuleProps {
  strategy?: {
    id: string;
    name: string;
    state: string;
    [key: string]: any;
  };
  onNavigateBack?: () => Promise<void>;
  strategyId?: string;
}

/**
 * Type guard to check if an object is a FunnelMetadata
 */
export function isFunnelMetadata(obj: any): obj is FunnelMetadata {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'type' in obj &&
    obj.type === 'funnel' &&
    'is_final' in obj
  );
}
