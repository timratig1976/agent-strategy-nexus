
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FunnelData, FunnelStage } from '../types';
import { toast } from 'sonner';

// Helper type to ensure JSON compatibility
type JsonCompatible<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? JsonCompatible<T[K]>
    : T[K] extends Array<infer U>
    ? Array<JsonCompatible<U>>
    : T[K];
};

export const useFunnelData = (strategyId: string) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    strategyId,
    stages: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch funnel data from the database
  const fetchFunnelData = useCallback(async () => {
    if (!strategyId) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select('*')
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data && data.content) {
        // If funnel data exists, parse it
        const parsedData = typeof data.content === 'string' 
          ? JSON.parse(data.content) 
          : data.content;
          
        setFunnelData({
          strategyId,
          stages: parsedData.stages || []
        });
      } else {
        // Initialize with empty data
        setFunnelData({
          strategyId,
          stages: []
        });
      }
    } catch (err: any) {
      console.error('Error fetching funnel data:', err);
      setError(err.message || 'Failed to load funnel data');
      // Initialize with empty data on error
      setFunnelData({
        strategyId,
        stages: []
      });
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, [strategyId]);

  // Initialize on component mount
  useEffect(() => {
    fetchFunnelData();
  }, [fetchFunnelData]);
  
  // Handle stage changes
  const handleStagesChange = useCallback((stages: FunnelStage[]) => {
    setFunnelData(prev => {
      const newData = { ...prev, stages };
      setHasChanges(true);
      return newData;
    });
  }, []);

  // Save funnel data to the database
  const handleSave = useCallback(async () => {
    if (!strategyId) return false;
    
    try {
      setIsSaving(true);
      
      const { data: existingData, error: fetchError } = await supabase
        .from('ad_campaigns')
        .select('id')
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      let saveResult;
      
      // Convert funnelData to a JSON-compatible object for Supabase
      const jsonCompatibleData = {
        strategyId: funnelData.strategyId,
        stages: funnelData.stages
      } as JsonCompatible<FunnelData>;
      
      if (existingData) {
        // Update existing campaign
        const { error: updateError } = await supabase
          .from('ad_campaigns')
          .update({
            content: jsonCompatibleData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        if (updateError) throw updateError;
        saveResult = true;
      } else {
        // Create new campaign
        const { error: insertError } = await supabase
          .from('ad_campaigns')
          .insert({
            strategy_id: strategyId,
            content: jsonCompatibleData
          });
          
        if (insertError) throw insertError;
        saveResult = true;
      }
      
      setHasChanges(false);
      toast.success('Funnel strategy saved successfully');
      
      return saveResult;
    } catch (err: any) {
      console.error('Error saving funnel data:', err);
      toast.error(`Failed to save: ${err.message || 'Unknown error'}`);
      setError(err.message || 'Failed to save funnel data');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [strategyId, funnelData]);
  
  return {
    funnelData,
    isLoading,
    isSaving,
    hasChanges,
    error,
    handleStagesChange,
    handleSave,
    debugInfo
  };
};
