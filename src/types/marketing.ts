
export type AgentType = 'audience' | 'content' | 'seo' | 'social' | 'email' | 'analytics';
export type StrategyState = 'briefing' | 'persona' | 'pain_gains' | 'funnel' | 'ads';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  isActive: boolean;
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
  description?: string;
  state: StrategyState;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  state: StrategyState;
  createdAt: string;
  updatedAt: string;
  userId: string;
  agents: Agent[];
  results: AgentResult[];
  tasks: StrategyTask[];
}
