
import React from "react";
import { AIGeneratorPanel } from "@/components/ai-generator";
import { AgentResult } from "@/types/marketing";

interface BriefingEditorPanelProps {
  title: string;
  latestBriefing: AgentResult | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isGenerating: boolean;
  progress: number;
  briefingHistory: AgentResult[];
  aiDebugInfo: any;
  error: string | null;
  generateBriefing: (enhancementText?: string) => void;
  handleSaveBriefing: (isFinal: boolean) => Promise<void>;
  enhancerExpanded: boolean;
  toggleEnhancerExpanded: () => void;
  showPromptMonitor: boolean;
  togglePromptMonitor: () => void;
  generateButtonText: string;
  saveButtonText: string;
  saveFinalButtonText: string;
  placeholderText: string;
}

const BriefingEditorPanel: React.FC<BriefingEditorPanelProps> = ({
  title,
  latestBriefing,
  editedContent,
  setEditedContent,
  enhancementText,
  setEnhancementText,
  isGenerating,
  progress,
  briefingHistory,
  aiDebugInfo,
  error,
  generateBriefing,
  handleSaveBriefing,
  enhancerExpanded,
  toggleEnhancerExpanded,
  showPromptMonitor,
  togglePromptMonitor,
  generateButtonText,
  saveButtonText,
  saveFinalButtonText,
  placeholderText
}) => {
  // Create a wrapper function to adapt the handleGenerateBriefing to match what AIGeneratorPanel expects
  const handleGenerateContent = (customEnhancementText?: string) => {
    generateBriefing(customEnhancementText);
  };

  // Create a wrapper function to adapt the handleSaveBriefing to match what AIGeneratorPanel expects
  const handleSaveContent = async (isFinal: boolean) => {
    try {
      await handleSaveBriefing(isFinal);
      // Return nothing (void) to match expected type
      return;
    } catch (error) {
      console.error("Error saving briefing:", error);
      return;
    }
  };

  // Map the briefing history to match the AIGenerationResult format
  const generationHistory = briefingHistory.map(briefing => ({
    id: briefing.id,
    content: briefing.content,
    createdAt: briefing.created_at,
    metadata: briefing.metadata
  }));
  
  // Map the latest briefing to match the AIGenerationResult format
  const latestResult = latestBriefing ? {
    id: latestBriefing.id,
    content: latestBriefing.content,
    createdAt: latestBriefing.created_at,
    metadata: latestBriefing.metadata
  } : null;

  // Render the AIGeneratorPanel with appropriate props
  return (
    <AIGeneratorPanel
      title={title}
      latestResult={latestResult}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      enhancementText={enhancementText}
      setEnhancementText={setEnhancementText}
      isGenerating={isGenerating}
      progress={progress}
      generationHistory={generationHistory}
      aiDebugInfo={aiDebugInfo}
      error={error}
      generateContent={handleGenerateContent}
      handleSaveContent={handleSaveContent}
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

export default BriefingEditorPanel;
