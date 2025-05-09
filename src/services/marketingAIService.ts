
import { MarketingAIService as AIServiceImpl } from './ai/marketingAIService';
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
  AIServiceImpl as MarketingAIService,
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

// Create a namespace to add the static methods to the exported class
namespace MarketingAIServiceNamespace {
  export const generateContent = AIServiceImpl.generateContent;
  export const getStrategyMetadata = RPCService.getStrategyMetadata;
  export const updateStrategyMetadata = RPCService.updateStrategyMetadata;
  export const generateUspCanvasProfile = UspCanvasService.generateUspCanvasProfile;
  export const generateUspCanvasValueMap = UspCanvasService.generateUspCanvasValueMap;
}

// Combine the class with the namespace methods
const CombinedMarketingAIService = Object.assign(
  AIServiceImpl,
  MarketingAIServiceNamespace
);

// Export the combined service
export { CombinedMarketingAIService as MarketingAIService };
