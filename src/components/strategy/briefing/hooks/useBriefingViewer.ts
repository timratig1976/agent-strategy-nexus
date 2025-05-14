
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useBriefingGenerator } from "./useBriefingGenerator";
import { useBriefingHistory } from "./useBriefingHistory";
import { Strategy } from "@/types/marketing";

interface UseBriefingViewerOptions {
  strategy: Strategy;
  onUpdateBriefing?: (content: string) => void;
}

export const useBriefingViewer = ({
  strategy,
  onUpdateBriefing
}: UseBriefingViewerOptions) => {
  const [enhancementText, setEnhancementText] = useState("");
  const [enhancerExpanded, setEnhancerExpanded] = useState(false);
  const [showPromptMonitor, setShowPromptMonitor] = useState(false);
  
  // Use the briefing history hook
  const { 
    briefingHistory, 
    setBriefingHistory,
    fetchBriefingHistory 
  } = useBriefingHistory(strategy.id);
  
  // Use the briefing generator hook
  const {
    isGenerating,
    progress,
    generateBriefing,
    briefingHistory: generatorHistory,
    aiDebugInfo,
    error
  } = useBriefingGenerator(strategy.id);
  
  // Get the latest briefing from the history
  const latestBriefing = briefingHistory.length > 0 ? briefingHistory[0] : null;
  
  // Generate content function
  const generateContent = useCallback(async (enhancementTextInput?: string) => {
    try {
      console.log("Generating briefing with enhancement text:", enhancementTextInput || enhancementText);
      
      // Get form values from strategy object
      const formValues = {
        name: strategy.name || '',
        companyName: strategy.metadata?.companyName || '',
        websiteUrl: strategy.metadata?.websiteUrl || '',
        productDescription: strategy.metadata?.productDescription || '',
        additionalInfo: strategy.metadata?.additionalInfo || ''
      };
      
      await generateBriefing(formValues, enhancementTextInput || enhancementText);
      
      // After generation, refresh the history
      await fetchBriefingHistory();
      
      return true;
    } catch (error) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate briefing: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    }
  }, [enhancementText, generateBriefing, fetchBriefingHistory, strategy]);
  
  // Save content function
  const saveContent = useCallback(async (content: string, isFinal?: boolean) => {
    if (onUpdateBriefing) {
      onUpdateBriefing(content);
      toast.success(isFinal ? "Final briefing saved" : "Briefing draft saved");
    }
  }, [onUpdateBriefing]);
  
  // Toggle functions
  const toggleEnhancerExpanded = useCallback(() => {
    setEnhancerExpanded(prev => !prev);
  }, []);
  
  const togglePromptMonitor = useCallback(() => {
    setShowPromptMonitor(prev => !prev);
  }, []);
  
  return {
    enhancementText,
    setEnhancementText,
    enhancerExpanded,
    toggleEnhancerExpanded,
    showPromptMonitor,
    togglePromptMonitor,
    latestBriefing,
    briefingHistory,
    isGenerating,
    progress,
    aiDebugInfo,
    error,
    generateContent,
    saveContent
  };
};
