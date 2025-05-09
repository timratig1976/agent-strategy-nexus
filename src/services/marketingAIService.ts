
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

// Extend the MarketingAIService class with the methods we're attaching
// This matches the declare module in the test file
interface MarketingAIServiceStatic {
  getStrategyMetadata(strategyId: string): Promise<AIServiceResponse<StrategyMetadata>>;
  updateStrategyMetadata(strategyId: string, metadata: Partial<StrategyMetadata>): Promise<AIServiceResponse<boolean>>;
  generateUspCanvasProfile(strategyId: string, content: string): Promise<AIServiceResponse<UspCanvasAIResult>>;
  generateUspCanvasValueMap(strategyId: string, content: string): Promise<AIServiceResponse<UspCanvasAIResult>>;
}

// Add RPC methods to MarketingAIService for backward compatibility
(MarketingAIService as unknown as MarketingAIServiceStatic).getStrategyMetadata = RPCService.getStrategyMetadata;
(MarketingAIService as unknown as MarketingAIServiceStatic).updateStrategyMetadata = RPCService.updateStrategyMetadata;

// Add USP Canvas methods to MarketingAIService for backward compatibility
(MarketingAIService as unknown as MarketingAIServiceStatic).generateUspCanvasProfile = UspCanvasService.generateUspCanvasProfile;
(MarketingAIService as unknown as MarketingAIServiceStatic).generateUspCanvasValueMap = UspCanvasService.generateUspCanvasValueMap;
