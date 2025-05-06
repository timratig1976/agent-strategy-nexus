
export interface ContentStrategyFormData {
  keyword: string;
  targetAudience: string;
  businessGoals: string;
  contentType: string;
  tone: string;
  additionalInfo: string;
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  subtopics: ContentSubtopic[];
  keywords: string[];
  formats: string[];
  channels: string[];
}

export interface ContentSubtopic {
  id: string;
  title: string;
  description: string;
  contentIdeas: ContentIdea[];
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  format: string;
  example?: string;
}

export interface ContentPillarCardProps {
  pillar: ContentPillar;
  onSave: () => void;
}

export interface ContentIdeasAccordionProps {
  subtopics: ContentSubtopic[];
}

export interface KeywordsAccordionProps {
  keywords: string[];
}

export interface DistributionStrategyAccordionProps {
  formats: string[];
  channels: string[];
}

export interface LoadingStateProps {
  message?: string;
}

export interface EmptyStateProps {
  message?: string;
}
