
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
      console.log("Fetching briefing history for strategy ID:", strategyId);
      
      const { data, error } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching briefing history:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Briefing history data:", data);
        
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
            : {} 
        }));

        setBriefingHistory(formattedResults);
        console.log("Formatted briefing history:", formattedResults);
      } else {
        console.log("No briefing history found");
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
      
      console.log("Generating briefing for strategy ID:", strategyId, "with values:", formValues);
      
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
        console.log("Generated briefing data:", data);
        
        // Calculate the next version number
        const nextVersion = briefingHistory.length > 0 ? 
          ((briefingHistory[0].metadata?.version || 0) as number) + 1 : 1;
        
        // Add the new result with version metadata to the briefing history
        const currentTime = new Date().toISOString();
        const updatedResult: AgentResult = {
          ...data,
          metadata: {
            ...(data.metadata || {}),
            version: nextVersion,
            generated_at: currentTime
          }
        };
        
        console.log("Updated result with metadata:", updatedResult);
        
        // Only update the database if we have a valid ID
        if (updatedResult.id) {
          // Update the database with the version information
          const { error: updateError } = await supabase
            .from('agent_results')
            .update({
              metadata: updatedResult.metadata
            })
            .eq('id', updatedResult.id);
            
          if (updateError) {
            console.error("Error updating agent result metadata:", updateError);
          }
        } else {
          console.error("Cannot update metadata: result ID is missing");
        }
          
        // Update local state
        setBriefingHistory(prev => [updatedResult, ...prev]);
        
        console.log("Updated briefing history:", [updatedResult, ...briefingHistory]);
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
      console.log("Saving agent result:", updatedResult);
      
      if (!updatedResult.id) {
        console.error("Cannot save result: ID is undefined");
        toast.error("Cannot save: Result ID is missing");
        return false;
      }
      
      const now = new Date().toISOString();
      
      const metadata = {
        ...(updatedResult.metadata || {}),
        manually_edited: true,
        edited_at: now
      };
      
      const { error } = await supabase
        .from('agent_results')
        .update({
          content: updatedResult.content,
          metadata: metadata
        })
        .eq('id', updatedResult.id);
      
      if (error) {
        console.error("Error updating agent result:", error);
        throw error;
      }
      
      // Update the briefing history
      const updatedHistory = briefingHistory.map(result => 
        result.id === updatedResult.id ? 
          {
            ...result,
            content: updatedResult.content,
            metadata: metadata
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
