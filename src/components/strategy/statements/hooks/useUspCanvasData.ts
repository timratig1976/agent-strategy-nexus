
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
        
        // First try to fetch from the canvas_history table
        const { data: historyData, error: historyError } = await supabase
          .from('canvas_history')
          .select('*')
          .eq('canvas_id', strategyId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (historyError) {
          console.error("Error fetching canvas history:", historyError);
          throw historyError;
        }
        
        // Check if we have history data
        if (historyData && historyData.length > 0) {
          const snapshotData = historyData[0].snapshot_data;
          
          // Map from snapshot_data structure to our expected USPCanvasData format
          const mappedData: USPCanvasData = {
            customerJobs: [],
            customerPains: [],
            customerGains: [],
            productServices: [],
            painRelievers: [],
            gainCreators: []
          };
          
          // Map customer items
          if (snapshotData.customerItems && Array.isArray(snapshotData.customerItems)) {
            snapshotData.customerItems.forEach((item: any) => {
              if (item.id.startsWith('job-')) {
                mappedData.customerJobs = [
                  ...(mappedData.customerJobs || []),
                  { 
                    id: item.id,
                    content: item.content,
                    priority: item.rating
                  }
                ];
              } else if (item.id.startsWith('pain-')) {
                mappedData.customerPains = [
                  ...(mappedData.customerPains || []),
                  { 
                    id: item.id,
                    content: item.content,
                    severity: item.rating
                  }
                ];
              } else if (item.id.startsWith('gain-')) {
                mappedData.customerGains = [
                  ...(mappedData.customerGains || []),
                  { 
                    id: item.id,
                    content: item.content,
                    importance: item.rating
                  }
                ];
              }
            });
          }
          
          // Map value items if they exist
          if (snapshotData.valueItems && Array.isArray(snapshotData.valueItems)) {
            snapshotData.valueItems.forEach((item: any) => {
              if (item.id.startsWith('product-')) {
                mappedData.productServices = [
                  ...(mappedData.productServices || []),
                  { 
                    id: item.id,
                    content: item.content
                  }
                ];
              } else if (item.id.startsWith('pain-reliever-')) {
                mappedData.painRelievers = [
                  ...(mappedData.painRelievers || []),
                  { 
                    id: item.id,
                    content: item.content
                  }
                ];
              } else if (item.id.startsWith('gain-creator-')) {
                mappedData.gainCreators = [
                  ...(mappedData.gainCreators || []),
                  { 
                    id: item.id,
                    content: item.content
                  }
                ];
              }
            });
          }
          
          setUspCanvasData(mappedData);
          console.log("USP Canvas data loaded from canvas_history:", mappedData);
        } else {
          // Try fallback to usp_canvas table if no history is found
          const { data: uspData, error: uspError } = await supabase
            .from('usp_canvas')
            .select('*')
            .eq('strategy_id', strategyId)
            .single();
            
          if (uspError && uspError.code !== 'PGRST116') { // Not found is okay
            console.error("Error fetching USP Canvas data:", uspError);
            throw uspError;
          }
          
          if (uspData) {
            const mappedData: USPCanvasData = {
              customerJobs: uspData.customer_jobs || [],
              customerPains: uspData.pain_points || [],
              customerGains: uspData.gains || [],
              productServices: uspData.differentiators?.productServices || [],
              painRelievers: uspData.differentiators?.painRelievers || [],
              gainCreators: uspData.differentiators?.gainCreators || []
            };
            
            setUspCanvasData(mappedData);
            console.log("USP Canvas data loaded from usp_canvas table:", mappedData);
          } else {
            // Final fallback: check if strategy has metadata with uspCanvas
            const { data: strategyData, error: strategyError } = await supabase
              .from('strategies')
              .select('metadata')
              .eq('id', strategyId)
              .single();
              
            if (strategyError) {
              console.error("Error fetching strategy metadata:", strategyError);
              throw strategyError;
            }
            
            if (strategyData?.metadata?.uspCanvas) {
              setUspCanvasData(strategyData.metadata.uspCanvas);
              console.log("USP Canvas data loaded from strategy metadata:", strategyData.metadata.uspCanvas);
            } else {
              console.log("No USP Canvas data found for strategy:", strategyId);
              setUspCanvasData(null);
            }
          }
        }
      } catch (err: any) {
        console.error("Error in useUspCanvasData hook:", err);
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
