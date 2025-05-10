
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
      
      // Set a request timeout to prevent hanging operations
      const timeoutId = setTimeout(() => {
        throw new Error("Database fetch operation timed out");
      }, 5000);
      
      const { data, error: fetchError } = await supabase
        .from('usp_canvas')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      // Clear the timeout since the operation completed
      clearTimeout(timeoutId);
      
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
      return { 
        canvas: null, 
        error: err instanceof Error ? 
          err.message : 
          "An error occurred while loading canvas data"
      };
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

      // Set a request timeout to prevent hanging operations
      const timeoutId = setTimeout(() => {
        throw new Error("Database save operation timed out");
      }, 5000);

      // Convert our canvas to the database format
      const dbCanvas = mapCanvasToDbFormat(canvas, strategyId);
      
      // Perform the upsert operation
      const { error: upsertError } = await supabase
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
      
      // Clear the timeout since the operation completed
      clearTimeout(timeoutId);
      
      if (upsertError) {
        console.error("Error saving canvas to database:", upsertError);
        return { success: false, error: "Failed to save canvas to database" };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error("Exception saving canvas to database:", err);
      return { 
        success: false, 
        error: err instanceof Error ? 
          err.message : 
          "An error occurred while saving canvas" 
      };
    }
  }
}
