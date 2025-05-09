
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

// Update the namespace directly
// This adds the static methods to the MarketingAIService class for backward compatibility
namespace MarketingAIService {
  export const getStrategyMetadata = RPCService.getStrategyMetadata;
  export const updateStrategyMetadata = RPCService.updateStrategyMetadata;
  export const generateUspCanvasProfile = UspCanvasService.generateUspCanvasProfile;
  export const generateUspCanvasValueMap = UspCanvasService.generateUspCanvasValueMap;
}

// Export the namespace for use
export { MarketingAIService };
