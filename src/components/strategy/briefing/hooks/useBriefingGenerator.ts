
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
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);

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

  // Load briefing history on mount
  useEffect(() => {
    fetchBriefingHistory();

    // Set up real-time subscription for agent_results
    const channel = supabase
      .channel('agent_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_results',
          filter: `strategy_id=eq.${strategyId}`
        },
        (payload) => {
          console.log('New agent result added:', payload);
          fetchBriefingHistory();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_results',
          filter: `strategy_id=eq.${strategyId}`
        },
        (payload) => {
          console.log('Agent result updated:', payload);
          fetchBriefingHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [strategyId]);

  // Function to generate AI briefing with progress updates
  const generateBriefing = async (
    formValues: StrategyFormValues, 
    enhancementText?: string
  ): Promise<void> => {
    try {
      setIsGenerating(true);
      setProgress(10);
      setAiDebugInfo(null); // Reset debug info
      
      console.log("Generating briefing for strategy ID:", strategyId, "with values:", formValues);
      console.log("Enhancement text:", enhancementText);
      
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
      
      // Generate the briefing content using the AI service
      const { data: aiResponse, error: aiError, debugInfo } = await MarketingAIService.generateContent<{ rawOutput: string }>(
        'briefing',
        'generate',
        {
          strategyId: strategyId,
          formData: formValues,
          enhancementText: enhancementText || '' // Ensure enhancement text is included
        }
      );
      
      // Store debug info for monitoring
      setAiDebugInfo(debugInfo);
      
      if (aiError) {
        clearInterval(progressInterval);
        throw new Error(aiError);
      }
      
      console.log("Generated briefing data:", aiResponse);

      // Calculate the next version number
      const nextVersion = briefingHistory.length > 0 ? 
        ((briefingHistory[0].metadata?.version || 0) as number) + 1 : 1;
      
      // Create a timestamp for the generation
      const currentTime = new Date().toISOString();
      
      // Create the agent result to save to the database with null agent_id
      // This should work if agent_id is nullable in the agent_results table
      const newResult = {
        agent_id: null, // Use null instead of a UUID or string
        strategy_id: strategyId,
        content: aiResponse?.rawOutput || "",
        metadata: {
          version: nextVersion,
          generated_at: currentTime,
          enhanced_with: enhancementText || undefined
        }
      };

      console.log("Saving new briefing result to database:", newResult);
      
      // Save the generated briefing to the database
      const { data: savedResult, error } = await supabase
        .from('agent_results')
        .insert(newResult)
        .select()
        .single();

      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) {
        console.error("Error saving new briefing:", error);
        throw error;
      }
      
      if (savedResult) {
        // Format the saved result to match our AgentResult type
        const formattedResult: AgentResult = {
          id: savedResult.id,
          agentId: savedResult.agent_id,
          strategyId: savedResult.strategy_id,
          content: savedResult.content,
          createdAt: savedResult.created_at,
          metadata: (typeof savedResult.metadata === 'object' && savedResult.metadata !== null) 
            ? savedResult.metadata as Record<string, any>
            : {}
        };
        
        // Update local state
        setBriefingHistory(prev => [formattedResult, ...prev]);
        console.log("Updated briefing history:", [formattedResult, ...briefingHistory]);
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
    setBriefingHistory,
    aiDebugInfo
  };
};
