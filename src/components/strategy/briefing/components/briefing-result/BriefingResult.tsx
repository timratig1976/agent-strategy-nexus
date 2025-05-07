
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { History, Sparkles } from "lucide-react";
import { BriefingResultProps } from "../../types";
import BriefingContentEditor from "./BriefingContentEditor";
import BriefingHistorySheet from "./BriefingHistorySheet";
import BriefingAIEnhancer from "./BriefingAIEnhancer";
import PromptMonitor from "./PromptMonitor";
import { toast } from "sonner";

export const BriefingResult: React.FC<BriefingResultProps> = ({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved,
  aiDebugInfo,
  customTitle = "AI Briefing",
  generateButtonText = "Generate Briefing",
  saveButtonText = "Save Briefing",
  saveFinalButtonText = "Save Final Briefing",
  placeholderText = "Generated content will appear here..."
}) => {
  const [editedContent, setEditedContent] = useState(latestBriefing?.content || "");
  const [enhancementText, setEnhancementText] = useState("");
  const [showPromptMonitor, setShowPromptMonitor] = useState(aiDebugInfo !== null && aiDebugInfo !== undefined);
  const [enhancerExpanded, setEnhancerExpanded] = useState(false);
  const [hasFinalVersion, setHasFinalVersion] = useState(false);

  // Effect to update edited content when latest briefing changes
  useEffect(() => {
    if (latestBriefing?.content) {
      setEditedContent(latestBriefing.content);
    }
  }, [latestBriefing]);

  // Effect to show prompt monitor if aiDebugInfo becomes available
  useEffect(() => {
    if (aiDebugInfo !== null && aiDebugInfo !== undefined) {
      setShowPromptMonitor(true);
    }
  }, [aiDebugInfo]);

  // Check if there's a final version in the history
  useEffect(() => {
    const finalVersion = briefingHistory.find(item => item.metadata?.is_final === true);
    setHasFinalVersion(!!finalVersion);
  }, [briefingHistory]);

  const handleGenerateBriefing = () => {
    generateBriefing(enhancementText);
    setEnhancementText("");
    setEnhancerExpanded(false);
  };

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
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{customTitle}</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateBriefing} 
            disabled={isGenerating}
            className="flex gap-1"
          >
            <Sparkles className="h-4 w-4" /> 
            {isGenerating ? "Generating..." : generateButtonText}
          </Button>
          <Sheet>
            <Sheet.Trigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1">
                <History className="h-4 w-4" /> History
              </Button>
            </Sheet.Trigger>
            <BriefingHistorySheet
              briefingHistory={briefingHistory}
              loadHistoricalVersion={(briefing) => setEditedContent(briefing.content)}
              onSelect={(content) => setEditedContent(content)}
            />
          </Sheet>
          {aiDebugInfo && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPromptMonitor(!showPromptMonitor)}
            >
              {showPromptMonitor ? "Hide AI Log" : "Show AI Log"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        {/* Special Instructions first */}
        <BriefingAIEnhancer 
          enhancementText={enhancementText} 
          setEnhancementText={setEnhancementText}
          isExpanded={enhancerExpanded}
          onToggleExpand={() => setEnhancerExpanded(!enhancerExpanded)}
          onSubmit={handleGenerateBriefing}
          isGenerating={isGenerating}
        />
        
        {/* Content Editor */}
        <div className="flex-grow mt-4">
          <BriefingContentEditor 
            content={latestBriefing?.content || ""} 
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            isGenerating={isGenerating}
            progress={progress}
            placeholder={placeholderText}
          />
        </div>
        
        {showPromptMonitor && aiDebugInfo && (
          <div className="mt-4">
            <PromptMonitor debugInfo={aiDebugInfo} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 w-full">
        <Button 
          variant="outline" 
          onClick={() => handleSaveBriefing(false)} 
          disabled={isGenerating || !editedContent.trim()} 
          className="flex-1"
        >
          {saveButtonText}
        </Button>
        <Button 
          onClick={() => handleSaveBriefing(true)} 
          disabled={isGenerating || !editedContent.trim()}
          className="flex-1"
        >
          {saveFinalButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BriefingResult;
