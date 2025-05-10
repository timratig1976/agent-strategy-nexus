
// Define types for the USP Canvas module

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

export interface CanvasHistoryEntry {
  id: string;
  timestamp: number;
  data: UspCanvas;
  isFinal: boolean;
  metadata: Record<string, any>;
}

// Simple structure for AI-generated results
export interface StoredAIResult {
  jobs?: Array<{ description?: string; title?: string; priority?: string }>;
  pains?: Array<{ description?: string; title?: string; severity?: string }>;
  gains?: Array<{ description?: string; title?: string; importance?: string }>;
}

// Add the missing exports referenced in the errors
export enum CanvasState {
  CUSTOMER_PROFILE = 'customer_profile',
  VALUE_MAP = 'value_map',
  OVERVIEW = 'overview',
}

export interface CanvasItem {
  id: string;
  content: string;
  rating: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

export type RelationshipType = 'job_to_service' | 'pain_to_reliever' | 'gain_to_creator';
