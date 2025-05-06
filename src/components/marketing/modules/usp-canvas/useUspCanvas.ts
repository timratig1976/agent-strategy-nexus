
import { useState } from 'react';
import { 
  UspCanvas, 
  CustomerJob, 
  CustomerPain, 
  CustomerGain,
  ProductService,
  PainReliever,
  GainCreator
} from './types';
import { v4 as uuidv4 } from 'uuid';

const initialCanvas: UspCanvas = {
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  productServices: [],
  painRelievers: [],
  gainCreators: []
};

export const useUspCanvas = () => {
  const [canvas, setCanvas] = useState<UspCanvas>(initialCanvas);
  const [activeTab, setActiveTab] = useState<string>("customer-profile");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<number>(0);

  // Customer Profile functions
  const addCustomerJob = (content: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newJob: CustomerJob = {
      id: uuidv4(),
      content,
      priority
    };
    setCanvas(prev => ({
      ...prev,
      customerJobs: [...prev.customerJobs, newJob]
    }));
    setIsSaved(false);
  };

  const updateCustomerJob = (id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCanvas(prev => ({
      ...prev,
      customerJobs: prev.customerJobs.map(job => 
        job.id === id ? { ...job, content, priority } : job
      )
    }));
    setIsSaved(false);
  };

  const deleteCustomerJob = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      customerJobs: prev.customerJobs.filter(job => job.id !== id),
      productServices: prev.productServices.map(service => ({
        ...service,
        relatedJobIds: service.relatedJobIds.filter(jobId => jobId !== id)
      }))
    }));
    setIsSaved(false);
  };

  const addCustomerPain = (content: string, severity: 'low' | 'medium' | 'high' = 'medium') => {
    const newPain: CustomerPain = {
      id: uuidv4(),
      content,
      severity
    };
    setCanvas(prev => ({
      ...prev,
      customerPains: [...prev.customerPains, newPain]
    }));
    setIsSaved(false);
  };

  const updateCustomerPain = (id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCanvas(prev => ({
      ...prev,
      customerPains: prev.customerPains.map(pain => 
        pain.id === id ? { ...pain, content, severity } : pain
      )
    }));
    setIsSaved(false);
  };

  const deleteCustomerPain = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      customerPains: prev.customerPains.filter(pain => pain.id !== id),
      painRelievers: prev.painRelievers.map(reliever => ({
        ...reliever,
        relatedPainIds: reliever.relatedPainIds.filter(painId => painId !== id)
      }))
    }));
    setIsSaved(false);
  };

  const addCustomerGain = (content: string, importance: 'low' | 'medium' | 'high' = 'medium') => {
    const newGain: CustomerGain = {
      id: uuidv4(),
      content,
      importance
    };
    setCanvas(prev => ({
      ...prev,
      customerGains: [...prev.customerGains, newGain]
    }));
    setIsSaved(false);
  };

  const updateCustomerGain = (id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCanvas(prev => ({
      ...prev,
      customerGains: prev.customerGains.map(gain => 
        gain.id === id ? { ...gain, content, importance } : gain
      )
    }));
    setIsSaved(false);
  };

  const deleteCustomerGain = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      customerGains: prev.customerGains.filter(gain => gain.id !== id),
      gainCreators: prev.gainCreators.map(creator => ({
        ...creator,
        relatedGainIds: creator.relatedGainIds.filter(gainId => gainId !== id)
      }))
    }));
    setIsSaved(false);
  };

  // Value Map functions
  const addProductService = (content: string, relatedJobIds: string[] = []) => {
    const newService: ProductService = {
      id: uuidv4(),
      content,
      relatedJobIds
    };
    setCanvas(prev => ({
      ...prev,
      productServices: [...prev.productServices, newService]
    }));
    setIsSaved(false);
  };

  const updateProductService = (id: string, content: string, relatedJobIds: string[]) => {
    setCanvas(prev => ({
      ...prev,
      productServices: prev.productServices.map(service => 
        service.id === id ? { ...service, content, relatedJobIds } : service
      )
    }));
    setIsSaved(false);
  };

  const deleteProductService = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      productServices: prev.productServices.filter(service => service.id !== id)
    }));
    setIsSaved(false);
  };

  const addPainReliever = (content: string, relatedPainIds: string[] = []) => {
    const newReliever: PainReliever = {
      id: uuidv4(),
      content,
      relatedPainIds
    };
    setCanvas(prev => ({
      ...prev,
      painRelievers: [...prev.painRelievers, newReliever]
    }));
    setIsSaved(false);
  };

  const updatePainReliever = (id: string, content: string, relatedPainIds: string[]) => {
    setCanvas(prev => ({
      ...prev,
      painRelievers: prev.painRelievers.map(reliever => 
        reliever.id === id ? { ...reliever, content, relatedPainIds } : reliever
      )
    }));
    setIsSaved(false);
  };

  const deletePainReliever = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      painRelievers: prev.painRelievers.filter(reliever => reliever.id !== id)
    }));
    setIsSaved(false);
  };

  const addGainCreator = (content: string, relatedGainIds: string[] = []) => {
    const newCreator: GainCreator = {
      id: uuidv4(),
      content,
      relatedGainIds
    };
    setCanvas(prev => ({
      ...prev,
      gainCreators: [...prev.gainCreators, newCreator]
    }));
    setIsSaved(false);
  };

  const updateGainCreator = (id: string, content: string, relatedGainIds: string[]) => {
    setCanvas(prev => ({
      ...prev,
      gainCreators: prev.gainCreators.map(creator => 
        creator.id === id ? { ...creator, content, relatedGainIds } : creator
      )
    }));
    setIsSaved(false);
  };

  const deleteGainCreator = (id: string) => {
    setCanvas(prev => ({
      ...prev,
      gainCreators: prev.gainCreators.filter(creator => creator.id !== id)
    }));
    setIsSaved(false);
  };

  // Canvas management
  const saveCanvas = async () => {
    setIsSaved(false);
    setSaveProgress(0);
    
    // Simulate saving process with progress
    const intervalId = setInterval(() => {
      setSaveProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setIsSaved(true);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const resetCanvas = () => {
    setCanvas(initialCanvas);
    setIsSaved(false);
  };

  return {
    canvas,
    activeTab,
    setActiveTab,
    isSaved,
    saveProgress,
    // Customer Profile
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    // Value Map
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    // Canvas management
    saveCanvas,
    resetCanvas
  };
};
