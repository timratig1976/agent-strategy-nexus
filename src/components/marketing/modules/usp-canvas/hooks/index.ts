import { useCanvasData } from './useCanvasData';
import { useCanvasStorage } from './useCanvasStorage';
import { useCanvasItems } from './useCanvasItems';
import { useCustomerProfile } from './useCustomerProfile';
import { useValueMap } from './useValueMap';
import { useRelationshipHandler } from './useRelationshipHandler';
import { useAIResults } from './useAIResults';
import { useAIContentHandler } from './useAIContentHandler';
import { useNavigation } from './useNavigation';
// We're keeping useCanvasStorage for backward compatibility but will prioritize database

export {
  useCanvasData,
  useCanvasStorage,
  useCanvasItems,
  useCustomerProfile,
  useValueMap,
  useRelationshipHandler,
  useAIResults,
  useAIContentHandler,
  useNavigation
};
