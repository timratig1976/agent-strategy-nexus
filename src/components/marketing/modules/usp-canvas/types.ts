
import { ReactNode } from "react";

export interface CustomerJob {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

export interface CustomerPain {
  id: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

export interface CustomerGain {
  id: string;
  content: string;
  importance: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

export interface ProductService {
  id: string;
  content: string;
  relatedJobIds: string[];
}

export interface PainReliever {
  id: string;
  content: string;
  relatedPainIds: string[];
}

export interface GainCreator {
  id: string;
  content: string;
  relatedGainIds: string[];
}

export interface UspCanvas {
  customerJobs: CustomerJob[];
  customerPains: CustomerPain[];
  customerGains: CustomerGain[];
  productServices: ProductService[];
  painRelievers: PainReliever[];
  gainCreators: GainCreator[];
}

// For handling persona data integration
export interface PersonaContextData {
  name?: string;
  demographics?: string;
  goals?: string;
  painPoints?: string;
  content?: string; // Raw content from the agent result
}
