
// Define marketing-related types for the application

export enum StrategyState {
  BRIEFING = 'briefing',
  PERSONA = 'persona',
  PAIN_GAINS = 'pain_gains',
  FUNNEL = 'funnel',
  ADS = 'ads',
  COMPLETED = 'completed'
}

export enum MarketingPhase {
  BRIEFING = 'briefing',
  WEBSITE_ANALYSIS = 'website_analysis',
  PERSONA_DEVELOPMENT = 'persona_development',
  USP_CANVAS = 'usp_canvas',
  USP_GENERATOR = 'usp_generator',
  CHANNEL_STRATEGY = 'channel_strategy',
  ROAS_CALCULATOR = 'roas_calculator',
  CAMPAIGN_IDEAS = 'campaign_ideas',
  AD_CREATIVE = 'ad_creative',
  LEAD_MAGNETS = 'lead_magnets',
  CONTENT_STRATEGY = 'content_strategy'
}

export enum AgentType {
  BRIEFING = 'briefing',
  PERSONA = 'persona',
  USP = 'usp',
  FUNNEL = 'funnel',
  ADS = 'ads'
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: string;
  state: StrategyState | string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  agents?: Agent[];
  results?: AgentResult[];
  tasks?: StrategyTask[];
  metadata?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: string;
  isActive: boolean;
  strategyId?: string;
}

export interface AgentResult {
  id: string;
  agentId: string;
  strategyId: string;
  content: string;
  createdAt: string;
  metadata: Record<string, any>;
}

export interface StrategyTask {
  id: string;
  strategyId: string;
  title: string;
  description: string;
  state: StrategyState | string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define database type for strategy_tasks table to avoid type mismatch
export type StrategyTaskDB = {
  id: string;
  strategy_id: string;
  title: string;
  description?: string | null;
  state: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};
