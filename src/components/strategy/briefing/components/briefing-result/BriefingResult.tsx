
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";
import BriefingEditorPanel from "./BriefingEditorPanel";
import { useBriefingEditor } from "../../hooks/useBriefingEditor";
import { useBriefingViewer } from "../../hooks/useBriefingViewer";

interface BriefingResultProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  progress: number;
  generateBriefing: (enhancementText?: string) => void;
  saveAgentResult: (content: string, isFinal?: boolean) => Promise<void>;
  briefingHistory: AgentResult[];
  setBriefingHistory: React.Dispatch<React.SetStateAction<AgentResult[]>>;
  onBriefingSaved?: (isFinal: boolean) => void;
  aiDebugInfo?: any;
  error?: string | null;
  customTitle?: string;
  generateButtonText?: string;
  saveButtonText?: string;
  saveFinalButtonText?: string;
  placeholderText?: string;
}

export const BriefingResult: React.FC<BriefingResultProps> = ({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved,
  aiDebugInfo = null,
  error = null,
  customTitle = "AI Briefing",
  generateButtonText = "Generate Briefing",
  saveButtonText = "Save Briefing",
  saveFinalButtonText = "Save Final Briefing",
  placeholderText = "Generated content will appear here..."
}) => {
  // Use our custom hooks to manage state
  const { editedContent, setEditedContent } = useBriefingEditor({
    initialContent: latestBriefing?.content || "",
    isGenerating
  });
  
  const {
    enhancerExpanded,
    showPromptMonitor,
    setShowPromptMonitor,
    toggleEnhancerExpanded,
    togglePromptMonitor
  } = useBriefingViewer();
  
  // Local state
  const [enhancementText, setEnhancementText] = useState("");
  const [hasFinalVersion, setHasFinalVersion] = useState(false);

  // Effect to show prompt monitor if aiDebugInfo becomes available
  useEffect(() => {
    if (aiDebugInfo !== null && aiDebugInfo !== undefined) {
      setShowPromptMonitor(true);
    }
  }, [aiDebugInfo, setShowPromptMonitor]);

  // Check if there's a final version in the history
  useEffect(() => {
    const finalVersion = briefingHistory.find(item => item.metadata?.is_final === true);
    setHasFinalVersion(!!finalVersion);
  }, [briefingHistory]);

  // Handler for saving briefings
  const handleSaveBriefing = async (isFinal: boolean = false) => {
    try {
      await saveAgentResult(editedContent, isFinal);
      
      toast.success(isFinal 
        ? "Final version saved successfully" 
        : "Draft saved successfully");
      
      // Update the local state to reflect the new final status
      if (isFinal) {
        setHasFinalVersion(true);
      }
      
      if (onBriefingSaved) {
        onBriefingSaved(isFinal);
      }
    } catch (error) {
      console.error("Error saving briefing:", error);
      toast.error("Failed to save");
    }
  };

  return (
    <BriefingEditorPanel
      title={customTitle}
      latestBriefing={latestBriefing}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      enhancementText={enhancementText}
      setEnhancementText={setEnhancementText}
      isGenerating={isGenerating}
      progress={progress}
      briefingHistory={briefingHistory}
      aiDebugInfo={aiDebugInfo}
      error={error}
      generateBriefing={generateBriefing}
      handleSaveBriefing={handleSaveBriefing}
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
