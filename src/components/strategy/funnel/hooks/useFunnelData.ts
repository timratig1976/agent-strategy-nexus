
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FunnelData, FunnelStage } from '../types';

export const useFunnelData = (strategyId?: string) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    stages: []
  });
  const [initialData, setInitialData] = useState<FunnelData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Calculate if there are unsaved changes
  const hasChanges = JSON.stringify(funnelData) !== JSON.stringify(initialData);

  // Load funnel data
  useEffect(() => {
    if (!strategyId) return;
    
    const loadFunnelData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('funnel_data')
          .select('*')
          .eq('strategy_id', strategyId)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, that's OK for a new funnel
            setFunnelData({
              stages: [
                {
                  id: "awareness",
                  name: "Awareness",
                  description: "Potential customers become aware of your product or service.",
                  touchpoints: []
                },
                {
                  id: "consideration",
                  name: "Consideration",
                  description: "Prospects evaluate your offering against alternatives.",
                  touchpoints: []
                },
                {
                  id: "conversion",
                  name: "Conversion",
                  description: "Prospects make a purchase decision.",
                  touchpoints: []
                },
                {
                  id: "retention",
                  name: "Retention",
                  description: "Keep customers engaged and coming back.",
                  touchpoints: []
                }
              ]
            });
            
            setInitialData({
              stages: [
                {
                  id: "awareness",
                  name: "Awareness",
                  description: "Potential customers become aware of your product or service.",
                  touchpoints: []
                },
                {
                  id: "consideration",
                  name: "Consideration",
                  description: "Prospects evaluate your offering against alternatives.",
                  touchpoints: []
                },
                {
                  id: "conversion",
                  name: "Conversion",
                  description: "Prospects make a purchase decision.",
                  touchpoints: []
                },
                {
                  id: "retention",
                  name: "Retention",
                  description: "Keep customers engaged and coming back.",
                  touchpoints: []
                }
              ]
            });
          } else {
            console.error('Error loading funnel data:', error);
            setError(`Failed to load funnel data: ${error.message}`);
          }
          setIsLoading(false);
          return;
        }
        
        if (data) {
          const loadedData = {
            stages: data.content?.stages || []
          };
          
          setFunnelData(loadedData);
          setInitialData(loadedData);
          
          // Store debug info
          setDebugInfo({
            type: 'funnel_data_load',
            timestamp: new Date().toISOString(),
            data: data
          });
        }
      } catch (err: any) {
        console.error('Exception loading funnel data:', err);
        setError(`Exception loading funnel data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFunnelData();
  }, [strategyId]);
  
  // Handle stage changes
  const handleStagesChange = useCallback((stages: FunnelStage[]) => {
    setFunnelData(prev => ({
      ...prev,
      stages
    }));
  }, []);
  
  // Save funnel data
  const handleSave = useCallback(async () => {
    if (!strategyId) {
      toast.error("Missing strategy ID");
      return false;
    }
    
    setIsSaving(true);
    
    try {
      const savePayload = {
        strategy_id: strategyId,
        content: funnelData
      };
      
      // Store debug info for the save operation
      const debugPayload = {
        type: 'funnel_data_save',
        timestamp: new Date().toISOString(),
        requestData: savePayload
      };
      
      // Check if record exists
      const { data: existing, error: checkError } = await supabase
        .from('funnel_data')
        .select('id')
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking funnel data existence:', checkError);
        toast.error(`Failed to save: ${checkError.message}`);
        setIsSaving(false);
        return false;
      }
      
      let result;
      
      if (existing) {
        // Update existing record
        result = await supabase
          .from('funnel_data')
          .update(savePayload)
          .eq('strategy_id', strategyId);
      } else {
        // Insert new record
        result = await supabase
          .from('funnel_data')
          .insert(savePayload);
      }
      
      const { error: saveError } = result;
      
      if (saveError) {
        console.error('Error saving funnel data:', saveError);
        toast.error(`Failed to save: ${saveError.message}`);
        
        // Update debug info
        setDebugInfo({
          ...debugPayload,
          error: saveError,
          success: false
        });
        
        setIsSaving(false);
        return false;
      }
      
      // Update initialData so hasChanges becomes false
      setInitialData({...funnelData});
      toast.success("Funnel data saved successfully");
      
      // Update debug info with success
      setDebugInfo({
        ...debugPayload,
        success: true,
        responseData: { status: 'success' }
      });
      
      return true;
    } catch (err: any) {
      console.error('Exception saving funnel data:', err);
      toast.error(`Exception saving funnel data: ${err.message}`);
      
      // Update debug info with error
      setDebugInfo({
        type: 'funnel_data_save',
        timestamp: new Date().toISOString(),
        error: err.message,
        success: false
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [strategyId, funnelData]);
  
  return {
    funnelData,
    setFunnelData,
    handleStagesChange,
    handleSave,
    isSaving,
    isLoading,
    error,
    hasChanges,
    debugInfo
  };
};
