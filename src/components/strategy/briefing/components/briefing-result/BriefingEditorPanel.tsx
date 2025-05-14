
import React, { useState, useEffect } from "react";
import { Strategy } from "@/types/marketing";
import { AIGeneratorPanel } from "@/components/ai-generator";
import { useStrategyDebug } from "@/hooks/useStrategyDebug";
import { useBriefingEditor } from '../../hooks/useBriefingEditor';
import { useBriefingViewer } from '../../hooks/useBriefingViewer';

interface BriefingEditorPanelProps {
  strategy: Strategy;
  briefing?: string;
  onUpdateBriefing: (briefing: string) => void;
}

const BriefingEditorPanel: React.FC<BriefingEditorPanelProps> = ({
  strategy,
  briefing = "",
  onUpdateBriefing
}) => {
  const { debugInfo } = useStrategyDebug();
  const isDebugEnabled = debugInfo !== null;
  
  // Use our briefing viewer hook to handle generation
  const {
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
    generateContent
  } = useBriefingViewer({
    strategy,
    onUpdateBriefing
  });
  
  // Use briefing editor for content editing
  const {
    editedContent,
    setEditedContent,
    resetContent
  } = useBriefingEditor({
    initialContent: briefing,
    isGenerating
  });
  
  // Update edited content when the briefing changes
  useEffect(() => {
    if (briefing) {
      setEditedContent(briefing);
    }
  }, [briefing, setEditedContent]);

  // Format history for AIGeneratorPanel
  const generationHistory = briefingHistory.map(briefing => ({
    id: briefing.id || '',
    content: briefing.content,
    createdAt: briefing.createdAt || new Date().toISOString(),
    metadata: briefing.metadata
  }));
  
  // Get the latest result for AIGeneratorPanel
  const latestResult = latestBriefing ? {
    id: latestBriefing.id || '',
    content: latestBriefing.content,
    createdAt: latestBriefing.createdAt || new Date().toISOString(),
    metadata: latestBriefing.metadata
  } : null;

  // Handler for saving content
  const handleSaveContent = async (isFinal: boolean) => {
    console.log("Saving content as", isFinal ? "final" : "draft");
    onUpdateBriefing(editedContent);
    return;
  };

  return (
    <AIGeneratorPanel
      title="Strategy Briefing"
      latestResult={latestResult}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      enhancementText={enhancementText}
      setEnhancementText={setEnhancementText}
      isGenerating={isGenerating}
      progress={progress}
      generationHistory={generationHistory}
      aiDebugInfo={isDebugEnabled ? debugInfo : null}
      error={error}
      generateContent={generateContent}
      handleSaveContent={handleSaveContent}
      enhancerExpanded={enhancerExpanded}
      toggleEnhancerExpanded={toggleEnhancerExpanded}
      showPromptMonitor={showPromptMonitor}
      togglePromptMonitor={togglePromptMonitor}
      generateButtonText="Generate Briefing"
      saveButtonText="Save Draft"
      saveFinalButtonText="Save as Final"
      placeholderText="Generated marketing strategy briefing will appear here..."
    />
  );
};

export default BriefingEditorPanel;
