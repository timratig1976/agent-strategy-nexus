import React from "react";
import { Strategy } from "@/types/marketing";
import AIGeneratorPanel from "@/components/ui/generator/AIGeneratorPanel";
import { useStrategyDebug } from "@/hooks/useStrategyDebug";
import { useBriefingEditor } from '../../hooks';
import { useBriefingHistory } from '../../hooks';

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
  
  const {
    content,
    setContent,
    isGenerating,
    isInstructionsVisible,
    toggleInstructions,
    handleGenerate,
    generationStatus,
    instructions,
    setInstructions,
    handleRegenerateWithInstructions
  } = useBriefingEditor({
    strategy,
    initialContent: briefing,
    onUpdateContent: onUpdateBriefing
  });
  
  const { 
    briefingHistory, 
    latestBriefing,
    isHistoryVisible,
    toggleHistory,
    loadBriefingFromHistory 
  } = useBriefingHistory({
    strategy,
    onSelectBriefing: (content) => {
      setContent(content);
      onUpdateBriefing(content);
    }
  });
  
  // Format history for AIGeneratorPanel
  const generationHistory = briefingHistory.map(briefing => ({
    id: briefing.id,
    content: briefing.content,
    createdAt: briefing.created_at || briefing.createdAt,
    metadata: briefing.metadata
  }));
  
  // Format latest result for AIGeneratorPanel
  const latestResult = latestBriefing ? {
    id: latestBriefing.id,
    content: latestBriefing.content,
    createdAt: latestBriefing.created_at || latestBriefing.createdAt,
    metadata: latestBriefing.metadata
  } : null;

  return (
    <AIGeneratorPanel
      title="Strategy Briefing"
      content={content}
      onContentChange={setContent}
      instructions={instructions}
      onInstructionsChange={setInstructions}
      isGenerating={isGenerating}
      isInstructionsVisible={isInstructionsVisible}
      onToggleInstructions={toggleInstructions}
      onGenerate={handleGenerate}
      onRegenerateWithInstructions={handleRegenerateWithInstructions}
      generationStatus={generationStatus}
      generationHistory={generationHistory}
      latestResult={latestResult}
      isHistoryVisible={isHistoryVisible}
      onToggleHistory={toggleHistory}
      onSelectHistoryItem={(item) => loadBriefingFromHistory(item.id)}
      debugInfo={isDebugEnabled ? debugInfo : null}
      onUpdateDebugInfo={setDebugInfo}
      historyTitle="Briefing History"
      includeAIResponseValidator={true}
      aiResponseValidatorConfig={{
        expectedStructure: "Comprehensive marketing strategy briefing with company details, industry analysis, target audience, goals and key performance indicators."
      }}
    />
  );
};

export default BriefingEditorPanel;
