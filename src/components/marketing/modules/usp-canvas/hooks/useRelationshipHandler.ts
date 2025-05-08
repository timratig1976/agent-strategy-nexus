
import { ProductService, PainReliever, GainCreator } from '../types';

export const useRelationshipHandler = (
  productServices: ProductService[],
  painRelievers: PainReliever[],
  gainCreators: GainCreator[],
  updateProductService: (id: string, content: string, relatedJobIds: string[]) => void,
  updatePainReliever: (id: string, content: string, relatedPainIds: string[]) => void,
  updateGainCreator: (id: string, content: string, relatedGainIds: string[]) => void
) => {
  // Update related items when deleting a customer job
  const handleCustomerJobDeletion = (id: string) => {
    productServices.forEach(service => {
      if (service.relatedJobIds.includes(id)) {
        updateProductService(
          service.id, 
          service.content, 
          service.relatedJobIds.filter(jobId => jobId !== id)
        );
      }
    });
  };
  
  // Update related items when deleting a customer pain
  const handleCustomerPainDeletion = (id: string) => {
    painRelievers.forEach(reliever => {
      if (reliever.relatedPainIds.includes(id)) {
        updatePainReliever(
          reliever.id,
          reliever.content,
          reliever.relatedPainIds.filter(painId => painId !== id)
        );
      }
    });
  };
  
  // Update related items when deleting a customer gain
  const handleCustomerGainDeletion = (id: string) => {
    gainCreators.forEach(creator => {
      if (creator.relatedGainIds.includes(id)) {
        updateGainCreator(
          creator.id,
          creator.content,
          creator.relatedGainIds.filter(gainId => gainId !== id)
        );
      }
    });
  };

  return {
    handleCustomerJobDeletion,
    handleCustomerPainDeletion,
    handleCustomerGainDeletion
  };
};
