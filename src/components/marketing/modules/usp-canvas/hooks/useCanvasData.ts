
import { useState, useEffect } from 'react';
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain, ProductService, PainReliever, GainCreator } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCanvasData = (strategyId?: string) => {
  const [canvasData, setCanvasData] = useState<UspCanvas | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the canvas data from the database
  const fetchCanvasData = async () => {
    if (!strategyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching USP canvas data for strategy:", strategyId);
      
      // First check if there's any data in localStorage for quick loading
      const localData = localStorage.getItem(`usp_canvas_${strategyId}`);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          if (parsedData.canvas) {
            setCanvasData(parsedData.canvas);
          }
        } catch (err) {
          console.error("Error parsing local canvas data:", err);
        }
      }
      
      // Try to fetch from database if available
      const { data, error } = await supabase
        .from('usp_canvas')
        .select('*')
        .eq('project_id', strategyId) // Using project_id as it matches our strategy_id
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching canvas data:", error);
        setError("Failed to load canvas data from the database");
      } else if (data) {
        console.log("Canvas data retrieved from database:", data);
        
        // Convert JSON data to our typed objects with proper type safety
        const customerJobs: CustomerJob[] = [];
        const customerPains: CustomerPain[] = [];
        const customerGains: CustomerGain[] = [];
        const productServices: ProductService[] = [];
        const painRelievers: PainReliever[] = [];
        const gainCreators: GainCreator[] = [];
        
        // Process customer jobs safely
        if (data.customer_jobs && Array.isArray(data.customer_jobs)) {
          data.customer_jobs.forEach(job => {
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
        
        // Process customer pains safely
        if (data.pain_points && Array.isArray(data.pain_points)) {
          data.pain_points.forEach(pain => {
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
        
        // Process customer gains safely
        if (data.gains && Array.isArray(data.gains)) {
          data.gains.forEach(gain => {
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
        
        // Process differentiators safely (if they contain product services)
        if (data.differentiators && Array.isArray(data.differentiators)) {
          // Try to extract product services, pain relievers, and gain creators from differentiators
          data.differentiators.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              // Check if it's a product service
              if ('relatedJobIds' in item) {
                const relatedJobIds: string[] = Array.isArray(item.relatedJobIds) 
                  ? item.relatedJobIds.map(id => String(id)) 
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
                  ? item.relatedPainIds.map(id => String(id))
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
                  ? item.relatedGainIds.map(id => String(id))
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

        // Create the canvas with the extracted data
        const canvas: UspCanvas = {
          customerJobs,
          customerPains,
          customerGains,
          productServices,
          painRelievers,
          gainCreators
        };
        
        setCanvasData(canvas);
        
        // Update local storage with the latest data
        localStorage.setItem(`usp_canvas_${strategyId}`, JSON.stringify({
          canvas,
          history: [{
            timestamp: Date.now(),
            data: canvas
          }]
        }));
      }
    } catch (err) {
      console.error("Exception fetching canvas data:", err);
      setError("An error occurred while loading canvas data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the canvas data to the database
  const saveCanvasToDatabase = async (canvas: UspCanvas) => {
    if (!strategyId) return false;
    
    try {
      console.log("Saving USP canvas to database for strategy:", strategyId);

      // Prepare the data for saving according to the database schema
      // Changed from upsert to insert with onConflict to fix TypeScript error
      const { error } = await supabase
        .from('usp_canvas')
        .insert({
          project_id: strategyId,
          customer_jobs: canvas.customerJobs,
          pain_points: canvas.customerPains,
          gains: canvas.customerGains,
          differentiators: [
            ...canvas.productServices,
            ...canvas.painRelievers, 
            ...canvas.gainCreators
          ], // Store all value map items in the differentiators field
          updated_at: new Date().toISOString()
        })
        .onConflict('project_id')
        .merge();
      
      if (error) {
        console.error("Error saving canvas to database:", error);
        toast.error("Failed to save canvas to database");
        return false;
      }
      
      toast.success("Canvas saved to database");
      return true;
    } catch (err) {
      console.error("Exception saving canvas to database:", err);
      toast.error("An error occurred while saving canvas");
      return false;
    }
  };

  // Load data when component mounts or strategyId changes
  useEffect(() => {
    fetchCanvasData();
  }, [strategyId]);

  return {
    canvasData,
    isLoading,
    error,
    fetchCanvasData,
    saveCanvasToDatabase
  };
};
