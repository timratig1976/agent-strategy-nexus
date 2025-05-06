
export interface ContentStrategyFormData {
  keyword: string;
  targetAudience: string;
  businessGoals: string;
  contentType: string;
  tone: string;
  additionalInfo: string;
  // Add these missing fields with defaults
  marketingGoals: string[];
  existingContent: string;
  competitorInsights: string;
  contentFormats: string[];
  distributionChannels: string[];
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  subtopics: ContentSubtopic[];
  keywords: string[];
  formats: string[];
  channels: string[];
  createdAt: Date;
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

// Added for ContentStrategyForm
export interface ContentStrategyFormProps {
  formData: ContentStrategyFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentStrategyFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  error: string | null;
}
