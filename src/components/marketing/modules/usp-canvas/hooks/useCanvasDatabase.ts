
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CanvasItem } from '../types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Define types for snapshot data
export interface CanvasSnapshot {
  customerItems: CanvasItem[];
  valueItems: CanvasItem[];
  timestamp: string;
}

// Define history record type that matches database structure
export interface CanvasHistoryRecord {
  id: string;
  canvas_id: string;
  snapshot_data: CanvasSnapshot;
  created_at: string;
  metadata?: {
    type: string;
    isFinal?: boolean;
  };
}

export default function useCanvasDatabase(canvasId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Save canvas data to the database history table
  const saveCanvasSnapshot = useCallback(
    async (data: CanvasSnapshot): Promise<boolean> => {
      if (!canvasId) return false;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Saving canvas snapshot to database', { canvasId, data });
        
        // Prepare metadata
        const metadata = {
          type: 'pain_gains',
          timestamp: new Date().toISOString()
        };
        
        // Deep clone the data to ensure it's properly serializable
        const serializableData = JSON.parse(JSON.stringify(data));
        
        // Insert new snapshot into canvas_history
        const { error: insertError } = await supabase
          .from('canvas_history')
          .insert({
            canvas_id: canvasId,
            snapshot_data: serializableData,
            metadata
          });
        
        if (insertError) {
          throw new Error(`Failed to save canvas snapshot: ${insertError.message}`);
        }
        
        console.log('Canvas snapshot saved successfully');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error saving canvas snapshot';
        console.error('Error saving canvas snapshot:', errorMessage);
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );
  
  // Load canvas history from the database
  const loadCanvasHistory = useCallback(async (): Promise<CanvasHistoryRecord[] | null> => {
    if (!canvasId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading canvas history from database', { canvasId });
      
      const { data, error: fetchError }: PostgrestSingleResponse<any[]> = await supabase
        .from('canvas_history')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(`Failed to load canvas history: ${fetchError.message}`);
      }
      
      if (!data || data.length === 0) {
        console.log('No canvas history found');
        return [];
      }
      
      // Transform the data to ensure type safety
      const typedData: CanvasHistoryRecord[] = data.map(item => ({
        id: item.id,
        canvas_id: item.canvas_id,
        snapshot_data: item.snapshot_data as CanvasSnapshot,
        created_at: item.created_at,
        metadata: item.metadata
      }));
      
      console.log('Canvas history loaded successfully', { count: typedData.length });
      return typedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading canvas history';
      console.error('Error loading canvas history:', errorMessage);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [canvasId]);

  return { loading, error, saveCanvasSnapshot, loadCanvasHistory };
}
