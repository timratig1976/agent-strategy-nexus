
import { useState } from "react";
import { toast } from "sonner";
import { MarketingAIService } from "@/services/marketingAIService";
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";
import { supabase } from "@/integrations/supabase/client";

export const useBriefingGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Function to generate AI briefing with progress updates
  const generateBriefing = async (formValues: StrategyFormValues) => {
    try {
      setIsGenerating(true);
      setProgress(10);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
      
      const { data, error } = await MarketingAIService.generateContent<AgentResult>(
        'briefing',
        'generate',
        {
          strategyId: strategyId,
          formData: formValues
        }
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) throw new Error(error);
      
      toast.success("AI Briefing generated successfully");
      
      // Wait a moment before refreshing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate AI briefing");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save agent result changes
  const saveAgentResult = async (updatedResult: AgentResult): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agent_results')
        .update({
          content: updatedResult.content,
          metadata: { 
            ...updatedResult.metadata,
            manually_edited: true,
            edited_at: new Date().toISOString()
          }
        })
        .eq('id', updatedResult.id);
      
      if (error) throw error;
      
      toast.success("Briefing content updated");
      return true;
    } catch (error) {
      console.error("Error updating agent result:", error);
      toast.error("Failed to update briefing content");
      return false;
    }
  };

  return {
    isGenerating,
    progress,
    generateBriefing,
    saveAgentResult
  };
};
