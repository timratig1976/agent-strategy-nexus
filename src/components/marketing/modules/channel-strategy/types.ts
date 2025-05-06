
export interface ChannelStrategyFormData {
  businessType: string;
  monthlyBudget: string;
  targetAudience: string;
  preferredChannels: string[];
  marketingGoals: string[];
  budgetFlexibility: number;
  timeframe: string;
  additionalInfo: string;
}

export interface ChannelAllocation {
  id: string;
  name: string;
  percentage: number;
  budgetAmount: number;
}

export interface KpiEstimate {
  name: string;
  value: string;
}

export interface ChannelRecommendation {
  channel: string;
  advice: string;
}

export interface ChannelStrategyResult {
  overview: string;
  channelAllocation: ChannelAllocation[];
  kpiEstimates: KpiEstimate[];
  recommendations: ChannelRecommendation[];
}
