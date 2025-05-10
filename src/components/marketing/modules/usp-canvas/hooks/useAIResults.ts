
import { useState, useEffect } from 'react';
import { StoredAIResult } from '../types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useAIResults = (strategyId: string) => {
  // Store AI results between tab switches
  const [storedAIResult, setStoredAIResult] = useState<StoredAIResult>({ jobs: [], pains: [], gains: [] });
  // Track IDs of already added items to prevent duplicates
  const [addedJobIds, setAddedJobIds] = useState<Set<string>>(new Set());
  const [addedPainIds, setAddedPainIds] = useState<Set<string>>(new Set());
  const [addedGainIds, setAddedGainIds] = useState<Set<string>>(new Set());

  // Load stored AI results on component mount
  useEffect(() => {
    if (strategyId) {
      try {
        const savedResultsKey = `usp_canvas_${strategyId}_ai_results`;
        const savedResults = localStorage.getItem(savedResultsKey);
        
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          if (parsedResults.data) {
            console.log('Loading stored AI results on module mount:', parsedResults.data);
            setStoredAIResult(parsedResults.data);
          }
        }
      } catch (error) {
        console.error('Error loading saved AI results on mount:', error);
      }
    }
  }, [strategyId]);

  // Handle adding AI-generated Jobs to Canvas
  const handleAddAIJobs = (jobs) => {
    if (!jobs || jobs.length === 0) {
      toast.info("No jobs to add");
      return [];
    }
    
    const newAddedIds = new Set(addedJobIds);
    const uniqueJobs = jobs.filter(job => {
      // Skip invalid items
      if (!job || (!job.content && !job.description)) {
        return false;
      }
      
      // Use content if available, fall back to description
      const content = job.content || job.description;
      if (!content || typeof content !== 'string' || !content.trim()) return false;
      
      // Create a unique identifier based on content and priority
      const idKey = `${content}-${job.priority || 'medium'}`;
      // Check if this combination already exists
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedJobIds(newAddedIds);
    
    if (uniqueJobs.length > 0) {
      // Map jobs to format expected by Canvas with specific job- prefix
      const formattedJobs = uniqueJobs.map(job => ({
        id: `job-${uuidv4()}`,
        content: job.content || job.description,
        rating: job.priority || 'medium',
        isAIGenerated: true
      }));
      return formattedJobs;
    } else {
      toast.info("All jobs have already been added");
      return [];
    }
  };

  // Handle adding AI-generated Pains to Canvas
  const handleAddAIPains = (pains) => {
    if (!pains || pains.length === 0) {
      toast.info("No pains to add");
      return [];
    }
    
    const newAddedIds = new Set(addedPainIds);
    const uniquePains = pains.filter(pain => {
      // Skip invalid items
      if (!pain || (!pain.content && !pain.description)) {
        return false;
      }
      
      // Use content if available, fall back to description
      const content = pain.content || pain.description;
      if (!content || typeof content !== 'string' || !content.trim()) return false;
      
      const idKey = `${content}-${pain.severity || 'medium'}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedPainIds(newAddedIds);
    
    if (uniquePains.length > 0) {
      // Map pains to format expected by Canvas with specific pain- prefix
      const formattedPains = uniquePains.map(pain => ({
        id: `pain-${uuidv4()}`,
        content: pain.content || pain.description,
        rating: pain.severity || 'medium',
        isAIGenerated: true
      }));
      return formattedPains;
    } else {
      toast.info("All pains have already been added");
      return [];
    }
  };

  // Handle adding AI-generated Gains to Canvas
  const handleAddAIGains = (gains) => {
    if (!gains || gains.length === 0) {
      toast.info("No gains to add");
      return [];
    }
    
    const newAddedIds = new Set(addedGainIds);
    const uniqueGains = gains.filter(gain => {
      // Skip invalid items
      if (!gain || (!gain.content && !gain.description)) {
        return false;
      }
      
      // Use content if available, fall back to description
      const content = gain.content || gain.description;
      if (!content || typeof content !== 'string' || !content.trim()) return false;
      
      const idKey = `${content}-${gain.importance || 'medium'}`;
      const isDuplicate = newAddedIds.has(idKey);
      if (!isDuplicate) {
        newAddedIds.add(idKey);
        return true;
      }
      return false;
    });
    
    setAddedGainIds(newAddedIds);
    
    if (uniqueGains.length > 0) {
      // Map gains to format expected by Canvas with specific gain- prefix
      const formattedGains = uniqueGains.map(gain => ({
        id: `gain-${uuidv4()}`,
        content: gain.content || gain.description,
        rating: gain.importance || 'medium',
        isAIGenerated: true
      }));
      return formattedGains;
    } else {
      toast.info("All gains have already been added");
      return [];
    }
  };

  // Handle storing AI results with more robust error handling
  const handleAIResultsGenerated = (result: any, debugInfo?: any) => {
    console.log('AI results generated callback received:', result);
    
    // Validate result structure before storing
    if (!result) {
      console.error('Empty result received in handleAIResultsGenerated');
      return;
    }
    
    // Ensure all arrays exist
    const validatedResult: StoredAIResult = {
      jobs: Array.isArray(result.jobs) ? result.jobs : [],
      pains: Array.isArray(result.pains) ? result.pains : [],
      gains: Array.isArray(result.gains) ? result.gains : []
    };
    
    // Store the validated result
    setStoredAIResult(validatedResult);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem(
        `usp_canvas_${strategyId}_ai_results`, 
        JSON.stringify({ data: validatedResult, debugInfo, timestamp: Date.now() })
      );
    } catch (err) {
      console.error('Error saving AI results in handleAIResultsGenerated:', err);
    }
  };

  return {
    storedAIResult,
    setStoredAIResult,
    handleAddAIJobs,
    handleAddAIPains,
    handleAddAIGains,
    handleAIResultsGenerated
  };
};
