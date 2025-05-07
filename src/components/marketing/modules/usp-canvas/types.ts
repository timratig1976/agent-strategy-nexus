
import { ReactNode } from 'react';

// Customer Profile Types
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

// Value Map Types
export interface ProductService {
  id: string;
  content: string;
  relatedJobIds: string[];
  isAIGenerated?: boolean;
}

export interface PainReliever {
  id: string;
  content: string;
  relatedPainIds: string[];
  isAIGenerated?: boolean;
}

export interface GainCreator {
  id: string;
  content: string;
  relatedGainIds: string[];
  isAIGenerated?: boolean;
}

// Full Canvas
export interface UspCanvas {
  customerJobs: CustomerJob[];
  customerPains: CustomerPain[];
  customerGains: CustomerGain[];
  productServices: ProductService[];
  painRelievers: PainReliever[];
  gainCreators: GainCreator[];
}

export interface CanvasSummary {
  totalJobs: number;
  totalPains: number;
  totalGains: number;
  totalServices: number;
  totalPainRelievers: number;
  totalGainCreators: number;
  jobFit: number;
  painFit: number;
  gainFit: number;
}

export interface ValueProposition {
  title: string;
  description: string;
  targetAudience: string;
  keyBenefits: string[];
}

export interface UspCanvasForm {
  companyDescription: string;
  targetAudience: string;
  competitorAdvantages: string;
  customerProblems: string;
}

export interface UspCanvasState {
  form: UspCanvasForm;
  canvas: UspCanvas;
  valueProposition: ValueProposition | null;
}

export interface CanvasSection {
  title: string;
  description: string;
  icon: ReactNode;
  count: number;
}
