
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UspCanvas } from '../types';

export const useCanvasItems = (
  canvas: UspCanvas,
  setCanvas: React.Dispatch<React.SetStateAction<UspCanvas>>,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Customer Jobs
  const addCustomerJob = useCallback((content: string, priority: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newJob = { id: uuidv4(), content, priority, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs: [...prevCanvas.customerJobs, newJob],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updateCustomerJob = useCallback((id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs: prevCanvas.customerJobs.map(job =>
        job.id === id ? { ...job, content, priority } : job
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deleteCustomerJob = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs: prevCanvas.customerJobs.filter(job => job.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const reorderCustomerJobs = useCallback((reorderedJobs: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerJobs: reorderedJobs,
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  // Customer Pains
  const addCustomerPain = useCallback((content: string, severity: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newPain = { id: uuidv4(), content, severity, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerPains: [...prevCanvas.customerPains, newPain],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updateCustomerPain = useCallback((id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerPains: prevCanvas.customerPains.map(pain =>
        pain.id === id ? { ...pain, content, severity } : pain
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deleteCustomerPain = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerPains: prevCanvas.customerPains.filter(pain => pain.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const reorderCustomerPains = useCallback((reorderedPains: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerPains: reorderedPains,
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  // Customer Gains
  const addCustomerGain = useCallback((content: string, importance: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newGain = { id: uuidv4(), content, importance, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerGains: [...prevCanvas.customerGains, newGain],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updateCustomerGain = useCallback((id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerGains: prevCanvas.customerGains.map(gain =>
        gain.id === id ? { ...gain, content, importance } : gain
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deleteCustomerGain = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerGains: prevCanvas.customerGains.filter(gain => gain.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const reorderCustomerGains = useCallback((reorderedGains: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerGains: reorderedGains,
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  return {
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
