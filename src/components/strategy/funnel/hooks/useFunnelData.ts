
import { useState, useEffect } from 'react';
import { FunnelData, FunnelStage } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useFunnelData = (strategyId: string) => {
  // Initialize with proper strategyId and empty stages array
  const [funnelData, setFunnelData] = useState<FunnelData>({
    strategyId,
    stages: []
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load funnel data from the database
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!strategyId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch funnel data from agent_results
        const { data, error } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', strategyId)
          .eq('metadata->>type', 'funnel')
          .eq('metadata->>is_final', 'true')
          .order('created_at', { ascending: false })
          .maybeSingle();
          
        if (error) {
          console.error('Error loading funnel data:', error);
          setError(error.message);
          return;
        }
        
        if (data) {
          try {
            const parsedContent = JSON.parse(data.content);
            
            if (parsedContent && Array.isArray(parsedContent.stages)) {
              setFunnelData({
                strategyId,
                stages: parsedContent.stages as FunnelStage[]
              });
            } else {
              // Fallback if structure is wrong
              setFunnelData({
                strategyId,
                stages: []
              });
            }
          } catch (parseError) {
            console.error('Error parsing funnel data:', parseError);
            setError('Invalid funnel data format');
          }
        } else {
          // No funnel data yet, use default
          setFunnelData({
            strategyId,
            stages: []
          });
        }
      } catch (err: any) {
        console.error('Exception loading funnel data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFunnelData();
  }, [strategyId]);

  // Function to save funnel data
  const saveFunnelData = async (updatedData: FunnelData): Promise<boolean> => {
    try {
      // Update content and ensure it has strategyId
      const dataToSave = {
        ...updatedData,
        strategyId: strategyId
      };
      
      // First, update the final status of any existing final funnel results
      await supabase.rpc('update_agent_results_final_status', {
        strategy_id_param: strategyId,
        result_type_param: 'funnel'
      });
      
      // Insert new agent result with funnel data
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(dataToSave.stages),
          metadata: {
            type: 'funnel',
            is_final: 'true',
            source: 'user_edit',
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) {
        console.error('Error saving funnel data:', error);
        throw new Error(error.message);
      }
      
      // Update local state
      setFunnelData(dataToSave);
      
      return true;
    } catch (err) {
      console.error('Exception saving funnel data:', err);
      return false;
    }
  };

  return {
    funnelData,
    setFunnelData,
    isLoading,
    error,
    saveFunnelData
  };
};
