
import { useState } from "react";
import { toast } from "sonner";
import { MarketingAIService } from "@/services/marketingAIService";
import { StrategyFormValues } from "@/components/strategy-form";
import { supabase } from "@/integrations/supabase/client";
import { useBriefingHistory } from "./useBriefingHistory";
import { useAgentResultSaver } from "./useAgentResultSaver";
import { useDocumentProcessing } from "@/hooks/useDocumentProcessing";

export const useBriefingGenerator = (strategyId: string) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    briefingHistory, 
    setBriefingHistory, 
    fetchBriefingHistory 
  } = useBriefingHistory(strategyId);
  
  const { saveAgentResult } = useAgentResultSaver();
  
  // Use the document processing hook to get document content
  const { 
    getDocumentContentForAI, 
    getWebsiteCrawlDataForAI,
    ensurePromptsExist 
  } = useDocumentProcessing(strategyId);

  // Function to generate AI briefing with progress updates
  const generateBriefing = async (
    formValues: StrategyFormValues, 
    enhancementText?: string
  ): Promise<void> => {
    try {
      setIsGenerating(true);
      setProgress(10);
      setAiDebugInfo(null); // Reset debug info
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
      
      try {
        // Generate the briefing content using the AI service
        const { data: aiResponse, error: aiError, debugInfo } = await MarketingAIService.generateContent<{ rawOutput: string }>(
          'briefing',
          'generate',
          {
            strategyId: strategyId,
            formData: formValues,
            enhancementText: enhancementText || '',
            documentContent: documentContent || '',
            websiteData: websiteCrawlData || '',
            outputLanguage: language as 'english' | 'deutsch'
          }
        );
        
        // Store debug info for monitoring
        setAiDebugInfo(debugInfo);
        
        if (aiError) {
          clearInterval(progressInterval);
          
          // If we get a "No prompts found" error, try installing default prompts and re-run
          if (aiError.includes("No prompts found for module")) {
            console.log("No prompts found. Attempting to create default prompts and retry...");
            
            const retryPromptCreation = await ensurePromptsExist('briefing');
            
            if (retryPromptCreation) {
              console.log("Default prompts created. Retrying briefing generation...");
              // Clear this interval first to prevent having multiple
              clearInterval(progressInterval);
              
              // Retry the generation (recursive call, but should only happen once)
              generateBriefing(formValues, enhancementText);
              return;
            }
          }
          
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
        const newResult = {
          agent_id: null, // Use null instead of hard-coded IDs
          strategy_id: strategyId,
          content: aiResponse?.rawOutput || "",
          metadata: {
            type: "briefing",
            is_final: false,
            version: nextVersion,
            generated_at: currentTime
          }
        };
        
        // Save the result to the database
        const savedResult = await saveAgentResult(strategyId, newResult.content, newResult.metadata);
        
        // Update local state with the new result
        if (savedResult) {
          setBriefingHistory(prev => [savedResult, ...prev]);
        }
        
        setProgress(100);
        toast.success("Briefing generated successfully");
      } catch (error) {
        clearInterval(progressInterval);
        console.error("AI Service error:", error);
        setError(error instanceof Error ? error.message : "AI service error");
        throw error;
      }
      
    } catch (error) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate briefing: " + 
        (error instanceof Error ? error.message : "Unknown error"));
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsGenerating(false);
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
