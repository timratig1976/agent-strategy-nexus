
export type AgentType = 'audience' | 'content' | 'seo' | 'social' | 'email' | 'analytics';

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

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  agents: Agent[];
  results: AgentResult[];
}
