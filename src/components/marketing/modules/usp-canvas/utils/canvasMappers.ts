
import { 
  CanvasItem, 
  CustomerJob, 
  CustomerPain, 
  CustomerGain, 
  ProductService, 
  PainReliever, 
  GainCreator,
  UspCanvas
} from '../types';

/**
 * Maps canvas items to specific types for the overview
 */
export const mapCanvasToSpecificTypes = (customerItems: CanvasItem[], valueItems: CanvasItem[]): UspCanvas => {
  const customerJobs: CustomerJob[] = customerItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      priority: item.rating,
      isAIGenerated: item.isAIGenerated
    }));
    
  const customerPains: CustomerPain[] = customerItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      severity: item.rating,
      isAIGenerated: item.isAIGenerated
    }));
    
  const customerGains: CustomerGain[] = customerItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      importance: item.rating,
      isAIGenerated: item.isAIGenerated
    }));
    
  const productServices: ProductService[] = valueItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedJobIds: []
    }));
    
  const painRelievers: PainReliever[] = valueItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedPainIds: []
    }));
    
  const gainCreators: GainCreator[] = valueItems
    .filter(item => item.rating === 'high' || item.rating === 'medium')
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedGainIds: []
    }));
    
  return {
    customerJobs,
    customerPains,
    customerGains,
    productServices,
    painRelievers,
    gainCreators
  };
};
