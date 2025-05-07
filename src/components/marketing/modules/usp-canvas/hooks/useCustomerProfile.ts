
import { useState } from 'react';
import { CustomerJob, CustomerPain, CustomerGain } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCustomerProfile = (
  initialJobs: CustomerJob[],
  initialPains: CustomerPain[],
  initialGains: CustomerGain[]
) => {
  const [customerJobs, setCustomerJobs] = useState<CustomerJob[]>(initialJobs);
  const [customerPains, setCustomerPains] = useState<CustomerPain[]>(initialPains);
  const [customerGains, setCustomerGains] = useState<CustomerGain[]>(initialGains);

  // Customer Jobs
  const addCustomerJob = (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newJob: CustomerJob = {
      id: uuidv4(),
      content,
      priority,
      isAIGenerated
    };
    setCustomerJobs(prev => [...prev, newJob]);
  };

  const updateCustomerJob = (id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCustomerJobs(prev => 
      prev.map(job => 
        job.id === id ? { ...job, content, priority } : job
      )
    );
  };

  const deleteCustomerJob = (id: string) => {
    setCustomerJobs(prev => prev.filter(job => job.id !== id));
  };

  const reorderCustomerJobs = (reorderedJobs: CustomerJob[]) => {
    setCustomerJobs(reorderedJobs);
  };

  // Customer Pains
  const addCustomerPain = (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newPain: CustomerPain = {
      id: uuidv4(),
      content,
      severity,
      isAIGenerated
    };
    setCustomerPains(prev => [...prev, newPain]);
  };

  const updateCustomerPain = (id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCustomerPains(prev => 
      prev.map(pain => 
        pain.id === id ? { ...pain, content, severity } : pain
      )
    );
  };

  const deleteCustomerPain = (id: string) => {
    setCustomerPains(prev => prev.filter(pain => pain.id !== id));
  };

  const reorderCustomerPains = (reorderedPains: CustomerPain[]) => {
    setCustomerPains(reorderedPains);
  };

  // Customer Gains
  const addCustomerGain = (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newGain: CustomerGain = {
      id: uuidv4(),
      content,
      importance,
      isAIGenerated
    };
    setCustomerGains(prev => [...prev, newGain]);
  };

  const updateCustomerGain = (id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCustomerGains(prev => 
      prev.map(gain => 
        gain.id === id ? { ...gain, content, importance } : gain
      )
    );
  };

  const deleteCustomerGain = (id: string) => {
    setCustomerGains(prev => prev.filter(gain => gain.id !== id));
  };

  const reorderCustomerGains = (reorderedGains: CustomerGain[]) => {
    setCustomerGains(reorderedGains);
  };

  return {
    customerJobs,
    customerPains,
    customerGains,
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    reorderCustomerJobs,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    reorderCustomerPains,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    reorderCustomerGains
  };
};
