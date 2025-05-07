
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentResult } from "@/types/marketing";
import { BriefingProgressBar } from "../BriefingProgressBar";
import BriefingAIEnhancer from "./BriefingAIEnhancer";
import { BriefingResultProps } from "../../types";
import PromptMonitor from "./PromptMonitor";
import BriefingHistorySheet from "./BriefingHistorySheet";
import BriefingContentEditor from "./BriefingContentEditor";

export function BriefingResult({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved,
  aiDebugInfo
}: BriefingResultProps) {
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [isEnhancerExpanded, setIsEnhancerExpanded] = useState<boolean>(false);

  // Reset edited content when latestBriefing changes
  useEffect(() => {
    if (latestBriefing) {
      setEditedContent(latestBriefing.content);
    } else {
      setEditedContent("");
    }
  }, [latestBriefing]);

  const handleSave = async (isFinal: boolean = false) => {
    if (!latestBriefing) return;
    
    setIsSaving(true);
    try {
      // Create a copy of the latest briefing with updated content
      const updatedBriefing: AgentResult = {
        ...latestBriefing,
        content: editedContent,
        metadata: {
          ...latestBriefing.metadata,
          is_final: isFinal, // Mark as final if specified
          enhanced_with: enhancementText ? enhancementText : undefined,
          manually_edited: true
        }
      };
      
      const success = await saveAgentResult(updatedBriefing);
      if (success && onBriefingSaved) {
        onBriefingSaved(isFinal);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBriefing = () => {
    // Pass enhancement text to the generate function
    generateBriefing(enhancementText);
  };

  // Handle loading a historical version
  const loadHistoricalVersion = (briefing: AgentResult) => {
    // Create a new array with the selected briefing first, followed by all other briefings
    const updatedHistory = [
      briefing,
      ...briefingHistory.filter(b => b.id !== briefing.id)
    ];
    
    // Set the updated history array directly
    setBriefingHistory(updatedHistory);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold">Strategy Briefing</CardTitle>
        <div className="flex items-center gap-2">
          {aiDebugInfo && (
            <PromptMonitor 
              debugInfo={aiDebugInfo}
              isError={!!aiDebugInfo?.responseData?.error}
            />
          )}
          <BriefingHistorySheet 
            briefingHistory={briefingHistory}
            loadHistoricalVersion={loadHistoricalVersion}
          />
        </div>
      </CardHeader>

      <CardContent>
        <BriefingAIEnhancer
          enhancementText={enhancementText}
          onEnhancementChange={setEnhancementText}
          isExpanded={isEnhancerExpanded}
          onToggleExpand={() => setIsEnhancerExpanded(!isEnhancerExpanded)}
        />

        {isGenerating ? (
          <div className="space-y-4">
            <BriefingProgressBar progress={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Generating your strategy briefing...
            </p>
          </div>
        ) : (
          <BriefingContentEditor
            latestBriefing={latestBriefing}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            enhancementText={enhancementText}
            isGenerating={isGenerating}
            isSaving={isSaving}
            handleSave={handleSave}
            handleGenerateBriefing={handleGenerateBriefing}
          />
        )}
      </CardContent>
    </Card>
  );
}
