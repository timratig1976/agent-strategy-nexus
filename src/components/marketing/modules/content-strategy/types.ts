
export interface ContentPillarFormData {
  businessNiche: string;
  targetAudience: string;
  brandVoice: string[];
  marketingGoals: string[];
  existingContent: string;
  competitorInsights: string;
  keyTopics: string[];
  contentFormats: string[];
  distributionChannels: string[];
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  keySubtopics: string[];
  contentIdeas: ContentIdeaItem[];
  keywords: string[];
  contentFormats: string[];
  distributionChannels: string[];
  createdAt: Date;
}

export interface ContentIdeaItem {
  title: string;
  format: string;
  channel: string;
  audience: string;
  estimatedEffort: string;
}
