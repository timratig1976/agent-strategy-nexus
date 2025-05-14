
// Ad campaign types

export interface AdCampaign {
  id?: string;
  strategy_id: string;
  content: any;
  created_at?: string;
  updated_at?: string;
}

export interface AdCreative {
  headline: string;
  description: string;
  imageUrl?: string;
  platform?: string;
}

export interface AdCampaignSettings {
  name: string;
  platform: string;
  budget: number;
  duration: number;
}
