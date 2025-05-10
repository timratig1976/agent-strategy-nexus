
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define simpler types to avoid deep nesting
interface BasicJsonObject {
  [key: string]: string | number | boolean | null | BasicJsonObject | BasicJsonArray;
}

interface BasicJsonArray extends Array<string | number | boolean | null | BasicJsonObject | BasicJsonArray> {}

// Define a simplified history entry to avoid infinite type recursion
interface CanvasHistoryEntry {
  id?: string;
  canvas_id: string;
  snapshot_data: BasicJsonObject;
  created_at?: string;
  metadata?: {
    description?: string;
    version?: number;
    [key: string]: any;
  };
}

export function useCanvasDatabase(canvasId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Save canvas history snapshot
  const saveCanvasSnapshot = useCallback(
    async (snapshotData: BasicJsonObject, metadata?: Record<string, any>) => {
      if (!canvasId) return null;
      setLoading(true);
      setError(null);

      try {
        const historyEntry: CanvasHistoryEntry = {
          canvas_id: canvasId,
          snapshot_data: snapshotData,
          metadata: metadata || {}
        };

        const { data, error: saveError } = await supabase
          .from('canvas_history')
          .insert(historyEntry)
          .select()
          .single();

        if (saveError) throw saveError;
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error saving canvas snapshot');
        setError(error);
        toast.error('Failed to save canvas snapshot');
        console.error(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );

  // Load canvas history snapshots
  const loadCanvasHistory = useCallback(async () => {
    if (!canvasId) return [];
    setLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('canvas_history')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;
      return data || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error loading canvas history');
      setError(error);
      toast.error('Failed to load canvas history');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [canvasId]);

  return {
    loading,
    error,
    saveCanvasSnapshot,
    loadCanvasHistory
  };
}

export default useCanvasDatabase;
