
import type { StrategyMetadata } from "@/integrations/supabase/client";

export interface AIServiceResponse<T> {
  data?: T;
  error?: string;
  debugInfo?: {
    requestData?: any;
    responseData?: any;
  };
}

export interface AIPrompt {
  id: string;
  module: string;
  systemPrompt: string;
  userPrompt: string;
  createdAt: string;
  updatedAt: string;
}

// Types for USP Canvas AI generation
export interface UspCanvasAIResult {
  jobs?: UspCanvasJob[];
  pains?: UspCanvasPain[];
  gains?: UspCanvasGain[];
  products?: UspCanvasProduct[];
  painRelievers?: UspCanvasPainReliever[];
  gainCreators?: UspCanvasGainCreator[];
}

export interface UspCanvasJob {
  content: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UspCanvasPain {
  content: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UspCanvasGain {
  content: string;
  importance: 'low' | 'medium' | 'high';
}

export interface UspCanvasProduct {
  content: string;
  relatedJobIds?: string[];
}

export interface UspCanvasPainReliever {
  content: string;
  relatedPainIds?: string[];
}

export interface UspCanvasGainCreator {
  content: string;
  relatedGainIds?: string[];
}

// Re-export the StrategyMetadata type for convenience
export type { StrategyMetadata };
