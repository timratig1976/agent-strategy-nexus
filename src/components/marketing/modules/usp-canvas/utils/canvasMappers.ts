
import { 
  CanvasItem, 
  UspCanvas, 
  CustomerJob, 
  CustomerPain, 
  CustomerGain, 
  ProductService, 
  PainReliever, 
  GainCreator 
} from '../types';

// Map flat arrays of items to the specific canvas object structure
export const mapCanvasToSpecificTypes = (
  customerItems: CanvasItem[], 
  valueItems: CanvasItem[]
): UspCanvas => {
  // Filter customer items by their ID prefixes
  const customerJobs: CustomerJob[] = customerItems
    .filter(item => item.id.startsWith('job-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      priority: item.rating as 'low' | 'medium' | 'high',
      isAIGenerated: item.isAIGenerated || false
    }));
    
  const customerPains: CustomerPain[] = customerItems
    .filter(item => item.id.startsWith('pain-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      severity: item.rating as 'low' | 'medium' | 'high',
      isAIGenerated: item.isAIGenerated || false
    }));
    
  const customerGains: CustomerGain[] = customerItems
    .filter(item => item.id.startsWith('gain-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      importance: item.rating as 'low' | 'medium' | 'high',
      isAIGenerated: item.isAIGenerated || false
    }));
  
  // Filter value items by their ID prefixes (if implemented)
  const productServices: ProductService[] = valueItems
    .filter(item => item.id.startsWith('product-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedJobIds: [],
      isAIGenerated: item.isAIGenerated || false
    }));
    
  const painRelievers: PainReliever[] = valueItems
    .filter(item => item.id.startsWith('reliever-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedPainIds: [],
      isAIGenerated: item.isAIGenerated || false
    }));
    
  const gainCreators: GainCreator[] = valueItems
    .filter(item => item.id.startsWith('creator-'))
    .map(item => ({
      id: item.id,
      content: item.content,
      relatedGainIds: [],
      isAIGenerated: item.isAIGenerated || false
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

// Map from specific canvas object structure back to flat arrays
export const mapSpecificTypesToCanvas = (
  canvas: UspCanvas
): { customerItems: CanvasItem[], valueItems: CanvasItem[] } => {
  const customerItems: CanvasItem[] = [
    ...canvas.customerJobs.map(job => ({
      id: job.id,
      content: job.content,
      rating: job.priority,
      isAIGenerated: job.isAIGenerated
    })),
    ...canvas.customerPains.map(pain => ({
      id: pain.id,
      content: pain.content,
      rating: pain.severity,
      isAIGenerated: pain.isAIGenerated
    })),
    ...canvas.customerGains.map(gain => ({
      id: gain.id,
      content: gain.content,
      rating: gain.importance,
      isAIGenerated: gain.isAIGenerated
    }))
  ];
  
  const valueItems: CanvasItem[] = [
    ...canvas.productServices.map(product => ({
      id: product.id,
      content: product.content,
      rating: 'medium', // Default rating for value items
      isAIGenerated: product.isAIGenerated
    })),
    ...canvas.painRelievers.map(reliever => ({
      id: reliever.id,
      content: reliever.content,
      rating: 'medium',
      isAIGenerated: reliever.isAIGenerated
    })),
    ...canvas.gainCreators.map(creator => ({
      id: creator.id,
      content: creator.content,
      rating: 'medium',
      isAIGenerated: creator.isAIGenerated
    }))
  ];
  
  return { customerItems, valueItems };
};
