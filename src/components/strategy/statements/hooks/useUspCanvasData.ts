
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface USPCanvasData {
  customerJobs?: any[];
  customerPains?: any[];
  customerGains?: any[];
  productServices?: any[];
  painRelievers?: any[];
  gainCreators?: any[];
}

const useUspCanvasData = (strategyId: string) => {
  const [uspCanvasData, setUspCanvasData] = useState<USPCanvasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchUspCanvasData = async () => {
      if (!strategyId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch strategy metadata which contains USP Canvas data
        const { data, error } = await supabase
          .from('strategies')
          .select('metadata')
          .eq('id', strategyId)
          .single();
          
        if (error) throw error;
        
        // Extract USP Canvas data from metadata
        const metadata = data?.metadata || {};
        const canvasData = metadata.uspCanvas || {};
        
        setUspCanvasData(canvasData);
      } catch (err: any) {
        console.error("Error fetching USP Canvas data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUspCanvasData();
  }, [strategyId]);
  
  return {
    uspCanvasData,
    isLoading,
    error
  };
};

export default useUspCanvasData;
