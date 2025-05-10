
import { supabase } from '@/integrations/supabase/client';
import { UspCanvas } from '../../types';
import { DbUspCanvas, mapCanvasToDbFormat, mapDbToCanvas } from './canvasMappers';

export class CanvasRepository {
  /**
   * Fetch canvas data for a strategy from the database
   */
  static async fetchCanvasData(strategyId: string): Promise<{
    canvas: UspCanvas | null;
    error: string | null;
  }> {
    try {
      console.log("Fetching USP canvas data for strategy:", strategyId);
      
      // Using any to avoid TypeScript deep instantiation
      const response: any = await supabase
        .from('usp_canvas')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const data = response.data?.[0];
      const fetchError = response.error;
      
      if (fetchError) {
        console.error("Error fetching canvas data:", fetchError);
        return { canvas: null, error: "Failed to load canvas data from the database" };
      } 
      
      if (data) {
        console.log("Canvas data retrieved from database:", data);
        // Map data to canvas structure
        const canvas = mapDbToCanvas(data);
        return { canvas, error: null };
      }
      
      return { canvas: null, error: null };
    } catch (err) {
      console.error("Exception fetching canvas data:", err);
      return { canvas: null, error: "An error occurred while loading canvas data" };
    }
  }

  /**
   * Save canvas data to the database
   */
  static async saveCanvasData(strategyId: string, canvas: UspCanvas): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      console.log("Saving USP canvas to database for strategy:", strategyId);

      // Convert our canvas to the database format
      const dbCanvas = mapCanvasToDbFormat(canvas, strategyId);
      
      // Perform the upsert operation
      const response: any = await supabase
        .from('usp_canvas')
        .upsert({
          strategy_id: dbCanvas.strategy_id,
          project_id: dbCanvas.project_id,
          customer_jobs: dbCanvas.customer_jobs,
          pain_points: dbCanvas.pain_points,
          gains: dbCanvas.gains,
          differentiators: dbCanvas.differentiators,
          updated_at: dbCanvas.updated_at,
          version: dbCanvas.version
        });
      
      const upsertError = response.error;
      
      if (upsertError) {
        console.error("Error saving canvas to database:", upsertError);
        return { success: false, error: "Failed to save canvas to database" };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error("Exception saving canvas to database:", err);
      return { success: false, error: "An error occurred while saving canvas" };
    }
  }
  
  /**
   * Fetch canvas history for a specific canvas
   */
  static async fetchCanvasHistory(canvasId: string): Promise<{
    history: any[];
    error: string | null;
  }> {
    try {
      console.log("Fetching canvas history for:", canvasId);
      
      // Using any to avoid TypeScript deep instantiation
      const response: any = await supabase
        .from('canvas_history')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('created_at', { ascending: false });
      
      const data = response.data || [];
      const fetchError = response.error;
      
      if (fetchError) {
        console.error("Error fetching canvas history:", fetchError);
        return { history: [], error: "Failed to load canvas history from the database" };
      } 
      
      return { history: data, error: null };
    } catch (err) {
      console.error("Exception fetching canvas history:", err);
      return { history: [], error: "An error occurred while loading canvas history" };
    }
  }
  
  /**
   * Save a new canvas history entry
   */
  static async saveCanvasHistorySnapshot(canvasId: string, snapshotData: any, metadata: any = {}): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      console.log("Saving canvas history snapshot for:", canvasId);
      
      // Using any to avoid TypeScript deep instantiation
      const response: any = await supabase
        .from('canvas_history')
        .insert({
          canvas_id: canvasId,
          snapshot_data: snapshotData,
          metadata: metadata
        });
      
      const insertError = response.error;
      
      if (insertError) {
        console.error("Error saving canvas history:", insertError);
        return { success: false, error: "Failed to save canvas history" };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error("Exception saving canvas history:", err);
      return { success: false, error: "An error occurred while saving canvas history" };
    }
  }
}
