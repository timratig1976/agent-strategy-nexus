
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
  AIServiceImpl,
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

// Create a static methods object
const MarketingAIService = {
  generateContent: AIServiceImpl.generateContent,
  getStrategyMetadata: RPCService.getStrategyMetadata,
  updateStrategyMetadata: RPCService.updateStrategyMetadata,
  generateUspCanvasProfile: UspCanvasService.generateUspCanvasProfile,
  generateUspCanvasValueMap: UspCanvasService.generateUspCanvasValueMap
};

// Export the combined service
export { MarketingAIService };
