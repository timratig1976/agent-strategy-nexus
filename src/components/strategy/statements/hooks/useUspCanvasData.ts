
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

// Make sure to export the hook as the default export
export default function useUspCanvasData(strategyId: string) {
  const [uspCanvasData, setUspCanvasData] = useState<USPCanvasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchUspCanvasData = async () => {
      if (!strategyId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch strategy with its data
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('id', strategyId)
          .single();
          
        if (error) throw error;
        
        // Check if uspCanvas data exists in metadata
        const uspCanvas = ((data as any)?.metadata?.uspCanvas) || {};
        
        setUspCanvasData(uspCanvas);
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
