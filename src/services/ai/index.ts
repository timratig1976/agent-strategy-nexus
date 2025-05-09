
// Clean re-export pattern (Best Practice #1)
// Re-export each service module - services
export { MarketingAIService } from './marketingAIService';
export { RPCService } from './rpcService';
export { UspCanvasService } from './uspCanvasService';

// Export types separately to avoid naming conflicts
export type { 
  AIServiceResponse, 
  AIPrompt, 
  UspCanvasAIResult,
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain,
  UspCanvasProduct,
  UspCanvasPainReliever,
  UspCanvasGainCreator,
  StrategyMetadata,
  OutputLanguage,
  FormatOptions
} from './types';
