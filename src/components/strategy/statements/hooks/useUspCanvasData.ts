
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        const formattedData = {
          jobs: data.customer_jobs || [],
          pains: data.pain_points || [],
          gains: data.gains || [],
          products: data.products || [],
          painRelievers: data.pain_relievers || [],
          gainCreators: data.gain_creators || []
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
