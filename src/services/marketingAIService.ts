
import { MarketingAIService } from './ai/marketingAIService';
import { RPCService } from './ai/rpcService';
import { UspCanvasService } from './ai/uspCanvasService';
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

// Create an interface to extend the MarketingAIService with static methods
interface MarketingAIServiceStatic {
  getStrategyMetadata: typeof RPCService.getStrategyMetadata;
  updateStrategyMetadata: typeof RPCService.updateStrategyMetadata;
  generateUspCanvasProfile: typeof UspCanvasService.generateUspCanvasProfile;
  generateUspCanvasValueMap: typeof UspCanvasService.generateUspCanvasValueMap;
}

// Add RPC methods to MarketingAIService for backward compatibility
(MarketingAIService as unknown as MarketingAIServiceStatic).getStrategyMetadata = RPCService.getStrategyMetadata;
(MarketingAIService as unknown as MarketingAIServiceStatic).updateStrategyMetadata = RPCService.updateStrategyMetadata;

// Add USP Canvas methods to MarketingAIService for backward compatibility
(MarketingAIService as unknown as MarketingAIServiceStatic).generateUspCanvasProfile = UspCanvasService.generateUspCanvasProfile;
(MarketingAIService as unknown as MarketingAIServiceStatic).generateUspCanvasValueMap = UspCanvasService.generateUspCanvasValueMap;
