
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CustomerJob, CustomerPain, CustomerGain } from '../types';

export const useCustomerProfile = (
  initialJobs: CustomerJob[] = [],
  initialPains: CustomerPain[] = [],
  initialGains: CustomerGain[] = []
) => {
  const [customerJobs, setCustomerJobs] = useState<CustomerJob[]>(initialJobs);
  const [customerPains, setCustomerPains] = useState<CustomerPain[]>(initialPains);
  const [customerGains, setCustomerGains] = useState<CustomerGain[]>(initialGains);

  // Jobs operations
  const addCustomerJob = useCallback((content: string, priority: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newJob: CustomerJob = {
      id: uuidv4(),
      content,
      priority,
      isAIGenerated
    };
    setCustomerJobs(prev => [...prev, newJob]);
    return newJob;
  }, []);

  const updateCustomerJob = useCallback((id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCustomerJobs(prev =>
      prev.map(job => (job.id === id ? { ...job, content, priority } : job))
    );
  }, []);

  const deleteCustomerJob = useCallback((id: string) => {
    setCustomerJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  const reorderCustomerJobs = useCallback((reorderedJobs: CustomerJob[]) => {
    setCustomerJobs(reorderedJobs);
  }, []);

  // Pains operations
  const addCustomerPain = useCallback((content: string, severity: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newPain: CustomerPain = {
      id: uuidv4(),
      content,
      severity,
      isAIGenerated
    };
    setCustomerPains(prev => [...prev, newPain]);
    return newPain;
  }, []);

  const updateCustomerPain = useCallback((id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCustomerPains(prev =>
      prev.map(pain => (pain.id === id ? { ...pain, content, severity } : pain))
    );
  }, []);

  const deleteCustomerPain = useCallback((id: string) => {
    setCustomerPains(prev => prev.filter(pain => pain.id !== id));
  }, []);

  const reorderCustomerPains = useCallback((reorderedPains: CustomerPain[]) => {
    setCustomerPains(reorderedPains);
  }, []);

  // Gains operations
  const addCustomerGain = useCallback((content: string, importance: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newGain: CustomerGain = {
      id: uuidv4(),
      content,
      importance,
      isAIGenerated
    };
    setCustomerGains(prev => [...prev, newGain]);
    return newGain;
  }, []);

  const updateCustomerGain = useCallback((id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCustomerGains(prev =>
      prev.map(gain => (gain.id === id ? { ...gain, content, importance } : gain))
    );
  }, []);

  const deleteCustomerGain = useCallback((id: string) => {
    setCustomerGains(prev => prev.filter(gain => gain.id !== id));
  }, []);

  const reorderCustomerGains = useCallback((reorderedGains: CustomerGain[]) => {
    setCustomerGains(reorderedGains);
  }, []);

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
