
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CanvasItem } from '../types';

// Define simpler types to avoid deep nesting
interface BasicJsonObject {
  [key: string]: string | number | boolean | null | BasicJsonObject | BasicJsonArray;
}

interface BasicJsonArray extends Array<string | number | boolean | null | BasicJsonObject | BasicJsonArray> {}

// Define history entry type (not exported to avoid circular references)
interface HistoryEntry {
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

// Define the type for the Supabase query response
interface SupabaseQueryResult {
  data: any[] | null;
  error: Error | null;
}

// Helper function to prepare canvas data for storage
function prepareCanvasDataForStorage(canvasItems: CanvasItem[] = []): any[] {
  return canvasItems.map(item => ({
    id: item.id,
    content: item.content,
    rating: item.rating,
    isAIGenerated: item.isAIGenerated || false
  }));
}

export function useCanvasDatabase(canvasId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Save canvas history snapshot with timeout to prevent hanging operations
  const saveCanvasSnapshot = useCallback(
    async (data: { customerItems?: CanvasItem[], valueItems?: CanvasItem[], [key: string]: any }) => {
      if (!canvasId) return null;
      setLoading(true);
      setError(null);

      // Create a promise that rejects after a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timed out')), 10000);
      });

      try {
        // Prepare data for storage - convert CanvasItem arrays to simple objects
        const snapshotData: BasicJsonObject = {
          customerItems: prepareCanvasDataForStorage(data.customerItems),
          valueItems: prepareCanvasDataForStorage(data.valueItems),
          timestamp: data.timestamp || new Date().toISOString(),
          strategy_id: canvasId // Use strategy_id consistently
        };

        // Additional properties that are basic types
        Object.keys(data).forEach(key => {
          if (key !== 'customerItems' && key !== 'valueItems') {
            snapshotData[key] = data[key];
          }
        });

        const historyEntry: HistoryEntry = {
          canvas_id: canvasId,
          snapshot_data: snapshotData,
          metadata: data.metadata || { type: 'pain_gains' }
        };

        // Use Promise.race to implement timeout
        const result = await Promise.race([
          supabase
            .from('canvas_history')
            .insert({
              canvas_id: canvasId,
              snapshot_data: historyEntry.snapshot_data,
              metadata: historyEntry.metadata
            })
            .select('id')
            .single(),
          timeoutPromise
        ]);

        if ('error' in result && result.error) throw result.error;
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error saving canvas snapshot');
        setError(error);
        if (error.message.includes('timed out')) {
          toast.error('Database operation timed out. Changes saved to local storage instead.');
        } else {
          toast.error('Failed to save to database. Changes saved to local storage instead.');
        }
        console.error(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );

  // Load canvas history snapshots with timeout
  const loadCanvasHistory = useCallback(async () => {
    if (!canvasId) return [];
    setLoading(true);
    setError(null);

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 10000);
    });

    try {
      // Use Promise.race to implement timeout with proper typing
      const result = await Promise.race<SupabaseQueryResult | never>([
        supabase
          .from('canvas_history')
          .select('*')
          .eq('canvas_id', canvasId)
          .order('created_at', { ascending: false }),
        timeoutPromise
      ]);

      // We need to check if the result is from the database query (has data property)
      // or from the timeout promise (doesn't have data property)
      if ('data' in result && result.data !== null) {
        return result.data;
      }
      
      if ('error' in result && result.error) throw result.error;
      return [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error loading canvas history');
      setError(error);
      if (error.message.includes('timed out')) {
        toast.error('Database operation timed out. Using local storage instead.');
      } else {
        toast.error('Failed to load from database. Using local storage instead.');
      }
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
};

export default useCanvasDatabase;
