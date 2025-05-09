
import { MarketingAIService } from './ai/marketingAIService';
import { RPCService } from './ai/rpcService';
import { generateUspCanvasProfile, generateUspCanvasValueMap, UspCanvasService } from './ai/uspCanvasService';
import type { 
  AIServiceResponse, 
  AIPrompt, 
  UspCanvasAIResult,
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain,
  UspCanvasProduct,
  UspCanvasPainReliever,
  UspCanvasGainCreator,
  StrategyMetadata
} from './ai/types';

// Re-export everything from the new modular service files
export {
  MarketingAIService,
  RPCService,
  UspCanvasService
};

// Re-export types
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
  StrategyMetadata
};

// Add methods to the MarketingAIService class to maintain backward compatibility
// These will delegate to the appropriate service classes

// Add RPC methods to MarketingAIService for backward compatibility (Best Practice #2)
(MarketingAIService as any).getStrategyMetadata = RPCService.getStrategyMetadata;
(MarketingAIService as any).updateStrategyMetadata = RPCService.updateStrategyMetadata;

// Add USP Canvas methods to MarketingAIService for backward compatibility (Best Practice #2)
(MarketingAIService as any).generateUspCanvasProfile = generateUspCanvasProfile;
(MarketingAIService as any).generateUspCanvasValueMap = generateUspCanvasValueMap;
