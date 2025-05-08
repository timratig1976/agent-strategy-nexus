
import { useState } from "react";
import { toast } from "sonner";
import { MarketingAIService } from "@/services/marketingAIService";
import { StrategyFormValues } from "@/components/strategy-form";
import { supabase } from "@/integrations/supabase/client";
import { useBriefingHistory } from "./useBriefingHistory";
import { useAgentResultSaver } from "./useAgentResultSaver";

export const useBriefingGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  
  const { 
    briefingHistory, 
    setBriefingHistory, 
    fetchBriefingHistory 
  } = useBriefingHistory(strategyId);
  
  const { saveAgentResult } = useAgentResultSaver();

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
      
      // Get strategy information including language
      const { data: strategyData, error: strategyError } = await supabase
        .from('strategies')
        .select('language')
        .eq('id', strategyId)
        .single();
      
      if (strategyError) {
        console.error("Error fetching strategy language:", strategyError);
        // Continue with default language if there's an error
      }
      
      const language = strategyData?.language || 'english';
      console.log("Using language for AI generation:", language);
      
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
          enhancementText: enhancementText || '',
          outputLanguage: language as 'english' | 'deutsch'
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
      const newResult = {
        agent_id: null, // Use null instead of a UUID or string
        strategy_id: strategyId,
        content: aiResponse?.rawOutput || "",
        metadata: {
          version: nextVersion,
          generated_at: currentTime,
          enhanced_with: enhancementText || undefined,
          language: language
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
        const formattedResult = {
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
