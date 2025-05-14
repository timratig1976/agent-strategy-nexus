
import React, { useState } from "react";
import { Strategy, AgentResult } from "@/types/marketing";
import { AIGeneratorPanel } from "@/components/ai-generator";
import { useStrategyDebug } from "@/hooks/useStrategyDebug";
import { useBriefingEditor } from '../../hooks';
import { useBriefingHistory } from '../../hooks';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const { debugInfo, setDebugInfo } = useStrategyDebug();
  const isDebugEnabled = debugInfo !== null;
  
  const [enhancementText, setEnhancementText] = useState("");
  const [enhancerExpanded, setEnhancerExpanded] = useState(false);
  const [showPromptMonitor, setShowPromptMonitor] = useState(false);
  
  const {
    editedContent,
    setEditedContent,
    resetContent
  } = useBriefingEditor({
    initialContent: briefing,
    isGenerating: false
  });
  
  const { 
    briefingHistory, 
    fetchBriefingHistory,
    setBriefingHistory
  } = useBriefingHistory(strategy.id);
  
  // Format history for AIGeneratorPanel
  const generationHistory = briefingHistory.map(briefing => ({
    id: briefing.id || '',
    content: briefing.content,
    createdAt: briefing.createdAt || new Date().toISOString(),
    metadata: briefing.metadata
  }));
  
  // Get the latest briefing from the history
  const latestResult = briefingHistory.length > 0 ? {
    id: briefingHistory[0].id || '',
    content: briefingHistory[0].content,
    createdAt: briefingHistory[0].createdAt || new Date().toISOString(),
    metadata: briefingHistory[0].metadata
  } : null;

  // Handler for generating content
  const generateContent = (enhancementText?: string) => {
    console.log("Generate content with:", enhancementText);
    // Implementation would go here
  };

  // Handler for saving content
  const handleSaveContent = async (isFinal: boolean) => {
    console.log("Saving content as", isFinal ? "final" : "draft");
    onUpdateBriefing(editedContent);
    return;
  };

  // Toggle handlers for enhancer and monitor
  const toggleEnhancerExpanded = () => setEnhancerExpanded(!enhancerExpanded);
  const togglePromptMonitor = () => setShowPromptMonitor(!showPromptMonitor);

  return (
    <AIGeneratorPanel
      title="Strategy Briefing"
      latestResult={latestResult}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      enhancementText={enhancementText}
      setEnhancementText={setEnhancementText}
      isGenerating={false}
      progress={0}
      generationHistory={generationHistory}
      aiDebugInfo={isDebugEnabled ? debugInfo : null}
      error={null}
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
