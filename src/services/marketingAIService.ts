
import { MarketingAIService as AIServiceImpl } from './ai/marketingAIService';
import { RPCService } from './ai/rpcService';
import * as UspCanvasServiceExports from './ai/uspCanvasService';
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
  UspCanvasServiceExports as UspCanvasService
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
  generateUspCanvasProfile: UspCanvasServiceExports.generateUspCanvasProfile,
  generateUspCanvasValueProposition: UspCanvasServiceExports.generateUspCanvasValueProposition
};

// Export the combined service
export { MarketingAIService };
