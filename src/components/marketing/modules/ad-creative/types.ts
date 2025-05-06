
export interface AdCreativeFormData {
  platform: string;
  adType: string;
  productName: string;
  targetAudience: string;
  productDescription: string;
  uniqueSellingPoints: string;
  callToAction: string;
  tone: string;
  generateImage?: boolean;
  imageDescription?: string;
  imageUrl?: string;
}

export interface AdCreative {
  id?: string;
  headline: string;
  primaryText: string;
  description?: string;
  callToAction: string;
  target?: string;
  platform: string;
  adType: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SavedAd extends AdCreative {
  id: string;
}
