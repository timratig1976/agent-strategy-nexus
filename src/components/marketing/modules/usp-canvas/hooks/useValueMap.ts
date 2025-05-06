
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ProductService,
  PainReliever,
  GainCreator
} from '../types';

export const useValueMap = (
  initialServices: ProductService[] = [],
  initialRelievers: PainReliever[] = [],
  initialCreators: GainCreator[] = []
) => {
  const [productServices, setProductServices] = useState<ProductService[]>(initialServices);
  const [painRelievers, setPainRelievers] = useState<PainReliever[]>(initialRelievers);
  const [gainCreators, setGainCreators] = useState<GainCreator[]>(initialCreators);

  // Product Services functions
  const addProductService = (content: string, relatedJobIds: string[] = []) => {
    const newService: ProductService = {
      id: uuidv4(),
      content,
      relatedJobIds
    };
    setProductServices(prev => [...prev, newService]);
    return newService;
  };

  const updateProductService = (id: string, content: string, relatedJobIds: string[]) => {
    setProductServices(prev => prev.map(service => 
      service.id === id ? { ...service, content, relatedJobIds } : service
    ));
  };

  const deleteProductService = (id: string) => {
    setProductServices(prev => prev.filter(service => service.id !== id));
  };

  // Pain Relievers functions
  const addPainReliever = (content: string, relatedPainIds: string[] = []) => {
    const newReliever: PainReliever = {
      id: uuidv4(),
      content,
      relatedPainIds
    };
    setPainRelievers(prev => [...prev, newReliever]);
    return newReliever;
  };

  const updatePainReliever = (id: string, content: string, relatedPainIds: string[]) => {
    setPainRelievers(prev => prev.map(reliever => 
      reliever.id === id ? { ...reliever, content, relatedPainIds } : reliever
    ));
  };

  const deletePainReliever = (id: string) => {
    setPainRelievers(prev => prev.filter(reliever => reliever.id !== id));
  };

  // Gain Creators functions
  const addGainCreator = (content: string, relatedGainIds: string[] = []) => {
    const newCreator: GainCreator = {
      id: uuidv4(),
      content,
      relatedGainIds
    };
    setGainCreators(prev => [...prev, newCreator]);
    return newCreator;
  };

  const updateGainCreator = (id: string, content: string, relatedGainIds: string[]) => {
    setGainCreators(prev => prev.map(creator => 
      creator.id === id ? { ...creator, content, relatedGainIds } : creator
    ));
  };

  const deleteGainCreator = (id: string) => {
    setGainCreators(prev => prev.filter(creator => creator.id !== id));
  };

  return {
    productServices,
    painRelievers,
    gainCreators,
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator
  };
};
