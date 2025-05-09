
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain, ProductService, PainReliever, GainCreator } from '../../types';
import { Json } from '@/integrations/supabase/types';

// Helper types for database operations
export type DbUspCanvas = {
  strategy_id: string;
  project_id: string; // Still needed for existing data
  customer_jobs: Json;
  pain_points: Json;
  gains: Json;
  differentiators: Json;
  updated_at: string;
  version?: number;
};

// Convert application model to database model
export const mapCanvasToDbFormat = (canvas: UspCanvas, strategyId: string): DbUspCanvas => {
  return {
    strategy_id: strategyId,
    project_id: strategyId, // Use same ID for backward compatibility
    customer_jobs: canvas.customerJobs as unknown as Json,
    pain_points: canvas.customerPains as unknown as Json,
    gains: canvas.customerGains as unknown as Json,
    differentiators: [
      ...canvas.productServices,
      ...canvas.painRelievers,
      ...canvas.gainCreators
    ] as unknown as Json,
    updated_at: new Date().toISOString(),
    version: 1 // Default version
  };
};

// Process customer jobs from database format
export const processCustomerJobs = (dbJobs: any): CustomerJob[] => {
  const customerJobs: CustomerJob[] = [];
  
  if (dbJobs && Array.isArray(dbJobs)) {
    dbJobs.forEach((job: any) => {
      if (typeof job === 'object' && job !== null && 
          'id' in job && 'content' in job && 'priority' in job) {
        customerJobs.push({
          id: String(job.id),
          content: String(job.content),
          priority: job.priority === 'low' || job.priority === 'medium' || job.priority === 'high' 
            ? job.priority 
            : 'medium',
          isAIGenerated: Boolean(job.isAIGenerated || false)
        });
      }
    });
  }
  
  return customerJobs;
};

// Process customer pains from database format
export const processCustomerPains = (dbPains: any): CustomerPain[] => {
  const customerPains: CustomerPain[] = [];
  
  if (dbPains && Array.isArray(dbPains)) {
    dbPains.forEach((pain: any) => {
      if (typeof pain === 'object' && pain !== null && 
          'id' in pain && 'content' in pain && 'severity' in pain) {
        customerPains.push({
          id: String(pain.id),
          content: String(pain.content),
          severity: pain.severity === 'low' || pain.severity === 'medium' || pain.severity === 'high'
            ? pain.severity
            : 'medium',
          isAIGenerated: Boolean(pain.isAIGenerated || false)
        });
      }
    });
  }
  
  return customerPains;
};

// Process customer gains from database format
export const processCustomerGains = (dbGains: any): CustomerGain[] => {
  const customerGains: CustomerGain[] = [];
  
  if (dbGains && Array.isArray(dbGains)) {
    dbGains.forEach((gain: any) => {
      if (typeof gain === 'object' && gain !== null && 
          'id' in gain && 'content' in gain && 'importance' in gain) {
        customerGains.push({
          id: String(gain.id),
          content: String(gain.content),
          importance: gain.importance === 'low' || gain.importance === 'medium' || gain.importance === 'high'
            ? gain.importance
            : 'medium',
          isAIGenerated: Boolean(gain.isAIGenerated || false)
        });
      }
    });
  }
  
  return customerGains;
};

// Process value map items (product services, pain relievers, gain creators)
export const processDifferentiators = (dbDifferentiators: any): {
  productServices: ProductService[];
  painRelievers: PainReliever[];
  gainCreators: GainCreator[];
} => {
  const productServices: ProductService[] = [];
  const painRelievers: PainReliever[] = [];
  const gainCreators: GainCreator[] = [];
  
  if (dbDifferentiators && Array.isArray(dbDifferentiators)) {
    dbDifferentiators.forEach((item: any) => {
      if (typeof item === 'object' && item !== null) {
        // Check if it's a product service
        if ('relatedJobIds' in item) {
          const relatedJobIds: string[] = Array.isArray(item.relatedJobIds) 
            ? item.relatedJobIds.map((id: any) => String(id)) 
            : [];
          
          productServices.push({
            id: String(item.id),
            content: String(item.content),
            relatedJobIds
          });
        }
        // Check if it's a pain reliever
        else if ('relatedPainIds' in item) {
          const relatedPainIds: string[] = Array.isArray(item.relatedPainIds)
            ? item.relatedPainIds.map((id: any) => String(id))
            : [];
          
          painRelievers.push({
            id: String(item.id),
            content: String(item.content),
            relatedPainIds
          });
        }
        // Check if it's a gain creator
        else if ('relatedGainIds' in item) {
          const relatedGainIds: string[] = Array.isArray(item.relatedGainIds)
            ? item.relatedGainIds.map((id: any) => String(id))
            : [];
          
          gainCreators.push({
            id: String(item.id),
            content: String(item.content),
            relatedGainIds
          });
        }
      }
    });
  }
  
  return { productServices, painRelievers, gainCreators };
};

// Convert database model to application model
export const mapDbToCanvas = (dbData: any): UspCanvas => {
  // Process customer jobs, pains, and gains
  const customerJobs = processCustomerJobs(dbData.customer_jobs);
  const customerPains = processCustomerPains(dbData.pain_points);
  const customerGains = processCustomerGains(dbData.gains);
  
  // Process differentiators
  const { productServices, painRelievers, gainCreators } = processDifferentiators(dbData.differentiators);

  // Create the canvas with the extracted data
  return {
    customerJobs,
    customerPains,
    customerGains,
    productServices,
    painRelievers,
    gainCreators
  };
};
