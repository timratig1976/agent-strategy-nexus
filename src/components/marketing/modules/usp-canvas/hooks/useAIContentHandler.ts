
import { CustomerJob, CustomerPain, CustomerGain } from '../types';
import { toast } from 'sonner';

export const useAIContentHandler = (
  addCustomerJob: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void,
  addCustomerPain: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void,
  addCustomerGain: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void
) => {
  // Function to apply AI-generated results to the canvas
  const applyAIGeneratedContent = (
    aiJobs?: CustomerJob[],
    aiPains?: CustomerPain[],
    aiGains?: CustomerGain[]
  ) => {
    // Apply jobs if provided
    if (aiJobs && aiJobs.length > 0) {
      aiJobs.forEach(job => {
        addCustomerJob(job.content, job.priority, true);
      });
      toast.success(`Added ${aiJobs.length} AI-generated jobs`);
    }
    
    // Apply pains if provided
    if (aiPains && aiPains.length > 0) {
      aiPains.forEach(pain => {
        addCustomerPain(pain.content, pain.severity, true);
      });
      toast.success(`Added ${aiPains.length} AI-generated pains`);
    }
    
    // Apply gains if provided
    if (aiGains && aiGains.length > 0) {
      aiGains.forEach(gain => {
        addCustomerGain(gain.content, gain.importance, true);
      });
      toast.success(`Added ${aiGains.length} AI-generated gains`);
    }
  };

  return {
    applyAIGeneratedContent
  };
};
