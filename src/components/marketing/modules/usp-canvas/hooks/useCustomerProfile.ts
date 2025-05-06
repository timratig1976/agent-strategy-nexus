
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  CustomerJob,
  CustomerPain,
  CustomerGain
} from '../types';

export const useCustomerProfile = (
  initialJobs: CustomerJob[] = [],
  initialPains: CustomerPain[] = [],
  initialGains: CustomerGain[] = []
) => {
  const [customerJobs, setCustomerJobs] = useState<CustomerJob[]>(initialJobs);
  const [customerPains, setCustomerPains] = useState<CustomerPain[]>(initialPains);
  const [customerGains, setCustomerGains] = useState<CustomerGain[]>(initialGains);

  // Customer Jobs functions
  const addCustomerJob = (content: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newJob: CustomerJob = {
      id: uuidv4(),
      content,
      priority
    };
    setCustomerJobs(prev => [...prev, newJob]);
    return newJob;
  };

  const updateCustomerJob = (id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCustomerJobs(prev => prev.map(job => 
      job.id === id ? { ...job, content, priority } : job
    ));
  };

  const deleteCustomerJob = (id: string) => {
    setCustomerJobs(prev => prev.filter(job => job.id !== id));
  };

  // Customer Pains functions
  const addCustomerPain = (content: string, severity: 'low' | 'medium' | 'high' = 'medium') => {
    const newPain: CustomerPain = {
      id: uuidv4(),
      content,
      severity
    };
    setCustomerPains(prev => [...prev, newPain]);
    return newPain;
  };

  const updateCustomerPain = (id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCustomerPains(prev => prev.map(pain => 
      pain.id === id ? { ...pain, content, severity } : pain
    ));
  };

  const deleteCustomerPain = (id: string) => {
    setCustomerPains(prev => prev.filter(pain => pain.id !== id));
  };

  // Customer Gains functions
  const addCustomerGain = (content: string, importance: 'low' | 'medium' | 'high' = 'medium') => {
    const newGain: CustomerGain = {
      id: uuidv4(),
      content,
      importance
    };
    setCustomerGains(prev => [...prev, newGain]);
    return newGain;
  };

  const updateCustomerGain = (id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCustomerGains(prev => prev.map(gain => 
      gain.id === id ? { ...gain, content, importance } : gain
    ));
  };

  const deleteCustomerGain = (id: string) => {
    setCustomerGains(prev => prev.filter(gain => gain.id !== id));
  };

  return {
    customerJobs,
    customerPains,
    customerGains,
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
  };
};
