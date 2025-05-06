
export interface UspFormData {
  businessName: string;
  industry: string;
  targetAudience: string;
  keyFeatures: string;
  competitorWeaknesses: string;
  businessValues: string[];
  businessStrengths: string[];
  customerPainPoints: string;
}

export interface UspItem {
  id: string;
  title: string;
  description: string;
  audience: string;
  supportingPoints: string[];
  differentiators: string[];
  applicationAreas: string[];
  createdAt: Date;
}
