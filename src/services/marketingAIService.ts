
import { supabase } from "@/integrations/supabase/client";

export interface AIServiceResponse<T> {
  data?: T;
  error?: string;
}

export class MarketingAIService {
  static async generateContent<T>(
    module: string, 
    action: 'generate' | 'edit', 
    data: any
  ): Promise<AIServiceResponse<T>> {
    try {
      const { data: result, error } = await supabase.functions.invoke('marketing-ai', {
        body: { module, action, data }
      });
      
      if (error) {
        console.error('Error invoking marketing AI function:', error);
        return { error: error.message || 'Failed to generate content' };
      }
      
      return { data: result.result as T };
    } catch (error) {
      console.error('Error in marketing AI service:', error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating content' 
      };
    }
  }
}
