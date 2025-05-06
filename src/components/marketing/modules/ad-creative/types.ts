
export interface AdCreativeFormData {
  campaignObjective: string;
  targetAudience: string;
  productService: string;
  keyBenefits: string[];
  brandTone: string;
  adPlatforms: string[];
  callToAction: string;
  additionalNotes: string;
}

export interface AdCreative {
  id: string;
  headline: string;
  description: string;
  callToAction: string;
  platform: string;
  format: string;
  visualDescription: string;
  targetAudience: string;
  createdAt: Date;
}
