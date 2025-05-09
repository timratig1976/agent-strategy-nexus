
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
  
  const { 
    briefingHistory, 
    setBriefingHistory, 
    fetchBriefingHistory 
  } = useBriefingHistory(strategyId);
  
  const { saveAgentResult } = useAgentResultSaver();
  
  // Use the document processing hook to get document content
  const { 
    getDocumentContentForAI, 
    getWebsiteCrawlDataForAI // Use the new function
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
      
      // Get document content for AI
      const documentContent = await getDocumentContentForAI();
      console.log("Document content available:", !!documentContent);
      
      // Get website crawl data for AI
      const websiteCrawlData = await getWebsiteCrawlDataForAI();
      console.log("Website crawl data available:", !!websiteCrawlData);
      
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
          documentContent: documentContent || '',
          websiteData: websiteCrawlData || '',  // Include website crawl data
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
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate briefing: " + 
        (error instanceof Error ? error.message : "Unknown error"));
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
    aiDebugInfo
  };
};
