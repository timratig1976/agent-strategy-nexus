
export interface LeadMagnetFormData {
  businessType: string;
  targetAudience: string;
  problemSolving: string;
  marketingGoals: string[];
  existingContent: string;
  brandVoice: string[];
  funnelStage: string[];
  contentFormats: string[];
}

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  funnelStage: string;
  format: string;
  contentOutline: string[];
  estimatedConversionRate: string;
  implementationSteps: string[];
  callToAction: string;
  createdAt: Date;
}
