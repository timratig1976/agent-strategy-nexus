
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUspCanvasData = (strategyId?: string) => {
  const [uspData, setUspData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!strategyId) return;

    const fetchUspData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if there's canvas history data for this strategy
        const { data: canvasData, error: canvasError } = await supabase
          .from('canvas_history')
          .select('*')
          .eq('canvas_id', strategyId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (canvasError) {
          console.error('Error fetching canvas data:', canvasError);
          setError(canvasError.message);
          return;
        }

        if (canvasData && canvasData.length > 0) {
          setUspData(canvasData[0].snapshot_data);
        }
      } catch (error: any) {
        console.error('Error in fetchUspData:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUspData();
  }, [strategyId]);

  return { uspData, isLoading, error };
};

export default useUspCanvasData;
