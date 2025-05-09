
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

// No need for declaration merging since the methods will be properly attached
// in the root marketingAIService.ts file

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

  // Test static method via RPCService directly
  const metadataResponse: AIServiceResponse<StrategyMetadata> = 
    await RPCService.getStrategyMetadata('test-id');
  
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
