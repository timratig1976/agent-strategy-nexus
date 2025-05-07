
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MarketingAIService } from "@/services/marketingAIService";
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";
import { supabase } from "@/integrations/supabase/client";

export const useBriefingGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [briefingHistory, setBriefingHistory] = useState<AgentResult[]>([]);

  // Load briefing history on mount
  useEffect(() => {
    fetchBriefingHistory();
  }, [strategyId]);

  const fetchBriefingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map the data from snake_case to camelCase and ensure metadata is properly typed
        const formattedResults: AgentResult[] = data.map(result => ({
          id: result.id,
          agentId: result.agent_id,
          strategyId: result.strategy_id,
          content: result.content,
          createdAt: result.created_at,
          // Ensure metadata is treated as a record by providing a default empty object
          metadata: (typeof result.metadata === 'object' && result.metadata !== null) 
            ? result.metadata as Record<string, any>
            : {} // Default to empty object if metadata is not an object or null
        }));

        setBriefingHistory(formattedResults);
      }
    } catch (error) {
      console.error("Error fetching briefing history:", error);
    }
  };

  // Function to generate AI briefing with progress updates
  const generateBriefing = async (formValues: StrategyFormValues): Promise<void> => {
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
      
      // Add version information
      if (data) {
        // Calculate the next version number
        const nextVersion = briefingHistory.length > 0 ? 
          ((briefingHistory[0].metadata?.version || 0) as number) + 1 : 1;
        
        // Add the new result with version metadata to the briefing history
        const updatedResult: AgentResult = {
          ...data,
          metadata: {
            ...data.metadata,
            version: nextVersion,
            generated_at: new Date().toISOString()
          }
        };
        
        // Update the database with the version information
        await supabase
          .from('agent_results')
          .update({
            metadata: updatedResult.metadata
          })
          .eq('id', updatedResult.id);
          
        // Update local state
        setBriefingHistory(prev => [updatedResult, ...prev]);
      }
      
      toast.success("AI Briefing generated successfully");
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
      
      // Update the briefing history
      const updatedHistory = briefingHistory.map(result => 
        result.id === updatedResult.id ? 
          {
            ...result,
            content: updatedResult.content,
            metadata: { 
              ...updatedResult.metadata,
              manually_edited: true,
              edited_at: new Date().toISOString()
            }
          } : result
      );
      
      setBriefingHistory(updatedHistory);
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
    saveAgentResult,
    briefingHistory,
    setBriefingHistory
  };
};
