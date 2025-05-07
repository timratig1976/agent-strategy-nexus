
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { History } from "lucide-react";
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

  // Effect to update edited content when latest briefing changes
  React.useEffect(() => {
    if (latestBriefing?.content) {
      setEditedContent(latestBriefing.content);
    }
  }, [latestBriefing]);

  // Effect to show prompt monitor if aiDebugInfo becomes available
  React.useEffect(() => {
    if (aiDebugInfo !== null && aiDebugInfo !== undefined) {
      setShowPromptMonitor(true);
    }
  }, [aiDebugInfo]);

  const handleGenerateBriefing = () => {
    generateBriefing(enhancementText);
    setEnhancementText("");
  };

  const handleSaveBriefing = async (isFinal: boolean = false) => {
    try {
      await saveAgentResult(editedContent, isFinal);
      
      toast.success(isFinal 
        ? "Final briefing saved successfully" 
        : "Briefing saved successfully");
      
      if (onBriefingSaved) {
        onBriefingSaved(isFinal);
      }
    } catch (error) {
      console.error("Error saving briefing:", error);
      toast.error("Failed to save briefing");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{customTitle}</CardTitle>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1">
                <History className="h-4 w-4" /> History
              </Button>
            </SheetTrigger>
            <BriefingHistorySheet
              briefingHistory={briefingHistory}
              onSelect={(content) => setEditedContent(content)}
            />
          </Sheet>
          {showPromptMonitor && (
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
        <div className="flex-grow">
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
      
      <CardFooter className="flex flex-col gap-4">
        <BriefingAIEnhancer 
          enhancementText={enhancementText} 
          setEnhancementText={setEnhancementText}
          onSubmit={handleGenerateBriefing}
          isGenerating={isGenerating}
        />
        
        <div className="flex gap-2 w-full">
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default BriefingResult;
