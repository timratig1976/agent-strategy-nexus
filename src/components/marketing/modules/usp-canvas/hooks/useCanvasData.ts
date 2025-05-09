
import { useState, useEffect } from 'react';
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain, ProductService, PainReliever, GainCreator } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Helper types for database operations
type DbUspCanvas = {
  project_id: string;
  customer_jobs: Json;
  pain_points: Json;
  gains: Json;
  differentiators: Json;
  updated_at: string;
  version?: number;
};

export const useCanvasData = (strategyId?: string) => {
  const [canvasData, setCanvasData] = useState<UspCanvas | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Convert application model to database model
  const mapCanvasToDbFormat = (canvas: UspCanvas, projectId: string): DbUspCanvas => {
    return {
      project_id: projectId,
      customer_jobs: canvas.customerJobs as unknown as Json,
      pain_points: canvas.customerPains as unknown as Json,
      gains: canvas.customerGains as unknown as Json,
      differentiators: [
        ...canvas.productServices,
        ...canvas.painRelievers,
        ...canvas.gainCreators
      ] as unknown as Json,
      updated_at: new Date().toISOString(),
      version: 1 // Default version
    };
  };

  // Convert database model to application model
  const mapDbToCanvas = (dbData: any): UspCanvas => {
    const customerJobs: CustomerJob[] = [];
    const customerPains: CustomerPain[] = [];
    const customerGains: CustomerGain[] = [];
    const productServices: ProductService[] = [];
    const painRelievers: PainReliever[] = [];
    const gainCreators: GainCreator[] = [];
    
    // Process customer jobs safely
    if (dbData.customer_jobs && Array.isArray(dbData.customer_jobs)) {
      dbData.customer_jobs.forEach((job: any) => {
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
    if (dbData.pain_points && Array.isArray(dbData.pain_points)) {
      dbData.pain_points.forEach((pain: any) => {
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
    if (dbData.gains && Array.isArray(dbData.gains)) {
      dbData.gains.forEach((gain: any) => {
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
    if (dbData.differentiators && Array.isArray(dbData.differentiators)) {
      // Try to extract product services, pain relievers, and gain creators from differentiators
      dbData.differentiators.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          // Check if it's a product service
          if ('relatedJobIds' in item) {
            const relatedJobIds: string[] = Array.isArray(item.relatedJobIds) 
              ? item.relatedJobIds.map((id: any) => String(id)) 
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
              ? item.relatedPainIds.map((id: any) => String(id))
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
              ? item.relatedGainIds.map((id: any) => String(id))
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
    return {
      customerJobs,
      customerPains,
      customerGains,
      productServices,
      painRelievers,
      gainCreators
    };
  };

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
      const { data, error: fetchError } = await supabase
        .from('usp_canvas')
        .select('*')
        .eq('project_id', strategyId) // Using project_id as it matches our strategy_id
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error fetching canvas data:", fetchError);
        setError("Failed to load canvas data from the database");
      } else if (data) {
        console.log("Canvas data retrieved from database:", data);
        
        // Map data to canvas structure
        const canvas = mapDbToCanvas(data);
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

      // Convert our canvas to the database format using the helper function
      const dbCanvas = mapCanvasToDbFormat(canvas, strategyId);
      
      // Perform the upsert operation with properly typed data
      const { error: upsertError } = await supabase
        .from('usp_canvas')
        .upsert(dbCanvas);
      
      if (upsertError) {
        console.error("Error saving canvas to database:", upsertError);
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
