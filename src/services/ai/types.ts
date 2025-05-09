
// If this file doesn't exist yet, create it

export type OutputLanguage = 'english' | 'deutsch';

export interface AIServiceResponse<T = any> {
  data?: T;
  error?: string;
  debugInfo?: any;
}

export interface AIPrompt {
  system_prompt: string;
  user_prompt: string;
}

export interface UspCanvasJob {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high'; // Add this property
}

export interface UspCanvasPain {
  id: string;
  title: string;
  description: string;
}

export interface UspCanvasGain {
  id: string;
  title: string;
  description: string;
}

export interface UspCanvasProduct {
  id: string;
  title: string;
  description: string;
}

export interface UspCanvasPainReliever {
  id: string;
  title: string;
  description: string;
  painIds: string[];
}

export interface UspCanvasGainCreator {
  id: string;
  title: string;
  description: string;
  gainIds: string[];
}

export interface UspCanvasAIResult {
  jobs?: UspCanvasJob[];
  pains?: UspCanvasPain[];
  gains?: UspCanvasGain[];
  products?: UspCanvasProduct[];
  painRelievers?: UspCanvasPainReliever[];
  gainCreators?: UspCanvasGainCreator[];
  rawOutput?: string;
}

export interface FormatOptions {
  outputLanguage?: OutputLanguage;
}

export interface StrategyMetadata {
  language?: string;
  currentPhase?: string;
  completedPhases?: string[];
  [key: string]: any;
}

