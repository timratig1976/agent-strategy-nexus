
export interface CampaignIdea {
  id: string;
  title: string;
  description: string;
  channels: string[];
  objectives: string[];
  targetAudience: string;
  estimatedBudget: string;
  estimatedTimeframe: string;
  createdAt: Date;
}

export interface CampaignFormData {
  industry: string;
  objective: string;
  audience: string;
  budget: string;
  timeframe: string;
  channels: string[];
  tone: string;
  additionalInfo: string;
}
