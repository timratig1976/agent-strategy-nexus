
import { MarketingAIService } from './ai/marketingAIService';
import { RPCService } from './ai/rpcService';
import { UspCanvasService } from './ai/uspCanvasService';
import { 
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
  UspCanvasService,
  // Types
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

// Add RPC methods to MarketingAIService for backward compatibility
MarketingAIService.getStrategyMetadata = RPCService.getStrategyMetadata;
MarketingAIService.updateStrategyMetadata = RPCService.updateStrategyMetadata;

// Add USP Canvas methods to MarketingAIService for backward compatibility
MarketingAIService.generateUspCanvasProfile = UspCanvasService.generateUspCanvasProfile;
MarketingAIService.generateUspCanvasValueMap = UspCanvasService.generateUspCanvasValueMap;
