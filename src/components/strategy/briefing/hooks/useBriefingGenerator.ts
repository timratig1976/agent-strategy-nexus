
import { useState } from "react";
import { toast } from "sonner";
import { StrategyFormValues } from "@/components/strategy-form";
import { supabase } from "@/integrations/supabase/client";
import { useBriefingHistory } from "./useBriefingHistory";
import { useAgentResultSaver } from "./useAgentResultSaver";
import { useDocumentProcessing } from "@/hooks/useDocumentProcessing";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useAgentResults } from "@/hooks/useAgentResults";
import { AgentCoreService } from "@/services/ai/agentCoreService";
import { AgentResult } from "@/types/marketing";

export const useBriefingGenerator = (strategyId: string) => {
  const [error, setError] = useState<string | null>(null);
  
  const { 
    briefingHistory, 
    setBriefingHistory, 
    fetchBriefingHistory 
  } = useBriefingHistory(strategyId);
  
  // Use the document processing hook to get document content
  const { 
    getDocumentContentForAI, 
    getWebsiteCrawlDataForAI,
    ensurePromptsExist 
  } = useDocumentProcessing(strategyId);

  // Use our new agent generation hook
  const {
    isGenerating,
    progress,
    debugInfo: aiDebugInfo,
    generateContent
  } = useAgentGeneration({
    strategyId,
    module: 'briefing'
  });

  // Function to generate AI briefing with progress updates
  const generateBriefing = async (
    formValues: StrategyFormValues, 
    enhancementText?: string
  ): Promise<void> => {
    try {
      setError(null); // Reset error state
      
      console.log("Generating briefing for strategy ID:", strategyId, "with values:", formValues);
      console.log("Enhancement text:", enhancementText);
      
      // Get strategy information including language
      const { data: strategyData, error: strategyError } = await supabase
        .from('strategies')
        .select('language')
        .eq('id', strategyId)
        .maybeSingle();
      
      if (strategyError) {
        console.error("Error fetching strategy language:", strategyError);
        // Continue with default language if there's an error
      }
      
      const language = strategyData?.language || 'english';
      console.log("Using language for AI generation:", language);
      
      // Get document content for AI
      const documentContent = await getDocumentContentForAI();
      console.log("Document content available:", !!documentContent);
      
      // Get website crawl data for AI
      const websiteCrawlData = await getWebsiteCrawlDataForAI();
      console.log("Website crawl data available:", !!websiteCrawlData);
      
      // Before proceeding, ensure the prompts exist for the 'briefing' module
      console.log("Checking if briefing prompts exist...");
      const promptsExist = await ensurePromptsExist('briefing');
      if (!promptsExist) {
        console.log("Creating default prompts failed, but proceeding anyway...");
      } else {
        console.log("Briefing prompts are available.");
      }
      
      try {
        // Generate the briefing content using our new hook
        const { data: aiResponse, error: aiError } = await generateContent<{ rawOutput: string }>({
          formData: formValues,
          enhancementText: enhancementText || '',
          documentContent: documentContent || '',
          websiteData: websiteCrawlData || '',
          outputLanguage: language as 'english' | 'deutsch'
        });
        
        if (aiError) {
          setError(aiError);
          throw new Error(aiError);
        }
        
        console.log("Generated briefing data:", aiResponse);

        // Calculate the next version number
        const nextVersion = briefingHistory.length > 0 ? 
          ((briefingHistory[0].metadata?.version || 0) as number) + 1 : 1;
        
        // Create a timestamp for the generation
        const currentTime = new Date().toISOString();
        
        // Create the agent result to save to the database with null agent_id
        const newResultContent = aiResponse?.rawOutput || "";
        const newResultMetadata = {
          type: "briefing",
          is_final: false,
          version: nextVersion,
          generated_at: currentTime
        };
        
        // Save the result to the database using AgentCoreService
        const savedResult = await AgentCoreService.saveAgentResult(
          strategyId, 
          newResultContent, 
          newResultMetadata, 
          null
        );
        
        // Update local state with the new result
        if (savedResult) {
          setBriefingHistory(prev => [savedResult as AgentResult, ...prev]);
        }
        
        toast.success("Briefing generated successfully");
      } catch (error) {
        console.error("AI Service error:", error);
        setError(error instanceof Error ? error.message : "AI service error");
        throw error;
      }
      
    } catch (error) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate briefing: " + 
        (error instanceof Error ? error.message : "Unknown error"));
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return {
    isGenerating,
    progress,
    generateBriefing,
    briefingHistory,
    setBriefingHistory,
    aiDebugInfo,
    error
  };
};
