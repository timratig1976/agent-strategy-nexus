
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

/**
 * Hook to fetch USP Canvas data for a strategy
 */
const useUspCanvasData = (strategyId: string) => {
  const [uspCanvasData, setUspCanvasData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUspCanvasData = useCallback(async () => {
    if (!strategyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch USP Canvas data from the database
      const { data, error } = await supabase
        .from('usp_canvas')
        .select('*')
        .eq('strategy_id', strategyId)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      
      // Process the data into a format suitable for statement generation
      if (data) {
        const customerJobs = data.customer_jobs as Json || [];
        const painPoints = data.pain_points as Json || [];
        const gains = data.gains as Json || [];
        
        // In our database, products, pain_relievers and gain_creators might 
        // be stored differently or not exist in the current schema
        // Use empty arrays as fallbacks
        const formattedData = {
          jobs: customerJobs,
          pains: painPoints,
          gains: gains,
          products: [], // Default to empty array if not in the schema
          painRelievers: [], // Default to empty array if not in the schema
          gainCreators: [] // Default to empty array if not in the schema
        };
        
        setUspCanvasData(formattedData);
      } else {
        setUspCanvasData(null);
      }
    } catch (err) {
      console.error('Error fetching USP Canvas data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [strategyId]);

  useEffect(() => {
    fetchUspCanvasData();
  }, [fetchUspCanvasData]);

  return { uspCanvasData, isLoading, error, refetch: fetchUspCanvasData };
};

export default useUspCanvasData;
