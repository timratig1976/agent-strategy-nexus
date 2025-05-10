
// Create new types file if it doesn't exist

export enum StrategyState {
  BRIEFING = 'briefing',
  PERSONA = 'persona',
  PAIN_GAINS = 'pain_gains',
  FUNNEL = 'funnel',
  ADS = 'ads',
  COMPLETED = 'completed'
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
  state: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
