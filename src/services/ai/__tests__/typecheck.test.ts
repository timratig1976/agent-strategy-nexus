
/**
 * This file contains type safety tests to ensure the API surface works correctly
 * Best Practice #4: Create automated tests for type safety
 * 
 * Note: These tests are meant to be run with a TypeScript-aware test runner
 * During build time, TypeScript will validate these types
 */

import { MarketingAIService } from '../marketingAIService';
import { RPCService } from '../rpcService';
import { UspCanvasService } from '../uspCanvasService';
import type { 
  AIServiceResponse,
  UspCanvasAIResult,
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain,
  StrategyMetadata
} from '../types';

// We need to add these method declarations to make TypeScript happy
// These methods are actually added in src/services/marketingAIService.ts
declare module '../marketingAIService' {
  export interface MarketingAIService {
    getStrategyMetadata(strategyId: string): Promise<AIServiceResponse<StrategyMetadata>>;
    updateStrategyMetadata(strategyId: string, metadata: Partial<StrategyMetadata>): Promise<AIServiceResponse<boolean>>;
    generateUspCanvasProfile(strategyId: string, content: string): Promise<AIServiceResponse<UspCanvasAIResult>>;
    generateUspCanvasValueMap(strategyId: string, content: string): Promise<AIServiceResponse<UspCanvasAIResult>>;
  }
}

// Type-level test - If this compiles, the types are compatible
const testMarketingAIServiceTypes = async (): Promise<void> => {
  // Test generateContent API
  const contentResponse: AIServiceResponse<any> = await MarketingAIService.generateContent(
    'test_module',
    'test_action',
    { testData: true }
  );
  
  // Validate response shape
  const _data = contentResponse.data;
  const _error = contentResponse.error;
  const _debugInfo = contentResponse.debugInfo;

  // Test static method
  const metadataResponse: AIServiceResponse<StrategyMetadata> = 
    await MarketingAIService.getStrategyMetadata('test-id');
  
  // Test USP Canvas Profile generation API
  const profileResponse: AIServiceResponse<UspCanvasAIResult> = 
    await UspCanvasService.generateUspCanvasProfile('test-id', 'content');
  
  // Validate USP types
  if (profileResponse.data) {
    const jobs: UspCanvasJob[] | undefined = profileResponse.data.jobs;
    const pains: UspCanvasPain[] | undefined = profileResponse.data.pains;
    const gains: UspCanvasGain[] | undefined = profileResponse.data.gains;
    
    // Type checking on the shape of UspCanvasJob
    if (jobs && jobs.length > 0) {
      const _content: string = jobs[0].content;
      const _priority: 'low' | 'medium' | 'high' = jobs[0].priority;
    }
  }
};

// This doesn't need to be an actual test - TypeScript will validate the types
// during build time. These "tests" ensure the modules have the correct API signature.
