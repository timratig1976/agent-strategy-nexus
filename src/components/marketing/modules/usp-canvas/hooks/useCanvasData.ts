
import { useState, useEffect } from 'react';
import { UspCanvas } from '../types';
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
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching canvas data:", error);
        setError("Failed to load canvas data from the database");
      } else if (data) {
        console.log("Canvas data retrieved from database:", data);
        
        // Map the database structure to our UspCanvas type
        const canvas: UspCanvas = {
          customerJobs: data.customer_jobs || [],
          customerPains: data.pain_points || [],
          customerGains: data.gains || [],
          productServices: data.products || [],
          painRelievers: data.pain_relievers || [],
          gainCreators: data.gain_creators || []
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
      
      const { error } = await supabase
        .from('usp_canvas')
        .upsert({
          strategy_id: strategyId,
          customer_jobs: canvas.customerJobs,
          pain_points: canvas.customerPains,
          gains: canvas.customerGains,
          products: canvas.productServices,
          pain_relievers: canvas.painRelievers,
          gain_creators: canvas.gainCreators,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'strategy_id'
        });
      
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
