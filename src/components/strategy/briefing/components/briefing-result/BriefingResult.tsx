
import React, { useState, useEffect } from "react";
import { AgentResult } from "@/types/marketing";
import { AIGeneratorPanel } from "@/components/ai-generator";
import { StrategyBriefingResultProps } from "../../types";

const BriefingResult: React.FC<StrategyBriefingResultProps> = ({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved,
  aiDebugInfo,
  error,
  customTitle = "Briefing Generator",
  generateButtonText = "Generate Briefing",
  saveButtonText = "Save Draft",
  saveFinalButtonText = "Save Final Briefing",
  placeholderText = "Generated briefing will appear here..."
}) => {
  const [editedContent, setEditedContent] = useState<string>("");
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [enhancerExpanded, setEnhancerExpanded] = useState<boolean>(false);
  const [showPromptMonitor, setShowPromptMonitor] = useState<boolean>(false);

  // Update edited content when the briefing changes
  useEffect(() => {
    if (latestBriefing && latestBriefing.content) {
      setEditedContent(latestBriefing.content);
    }
  }, [latestBriefing]);

  // Handle save - updated to conform to AIGeneratorPanel prop types
  const handleSaveBriefing = async (isFinal: boolean) => {
    try {
      await saveAgentResult(editedContent, isFinal);
      
      if (onBriefingSaved) {
        onBriefingSaved(isFinal);
      }
      
      // Return nothing (void) to match expected type
      return;
    } catch (error) {
      console.error("Error saving briefing:", error);
      return;
    }
  };

  const toggleEnhancerExpanded = () => {
    setEnhancerExpanded(!enhancerExpanded);
  };

  const togglePromptMonitor = () => {
    setShowPromptMonitor(!showPromptMonitor);
  };

  // Render the AIGeneratorPanel component with the appropriate props
  return (
    <AIGeneratorPanel
      title={customTitle}
      latestResult={latestBriefing}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      enhancementText={enhancementText}
      setEnhancementText={setEnhancementText}
      isGenerating={isGenerating}
      progress={progress}
      generationHistory={briefingHistory}
      aiDebugInfo={aiDebugInfo}
      error={error}
      generateContent={generateBriefing}
      handleSaveContent={handleSaveBriefing}
      enhancerExpanded={enhancerExpanded}
      toggleEnhancerExpanded={toggleEnhancerExpanded}
      showPromptMonitor={showPromptMonitor}
      togglePromptMonitor={togglePromptMonitor}
      generateButtonText={generateButtonText}
      saveButtonText={saveButtonText}
      saveFinalButtonText={saveFinalButtonText}
      placeholderText={placeholderText}
    />
  );
};

export default BriefingResult;
