
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";
import { StrategyBriefingResultProps } from "../../types";
import { StrategyState } from "@/types/marketing";
import { useAgentResultSaver } from "../../hooks/useAgentResultSaver";
import { StrategyDebugPanel } from "@/components/strategy/debug";
import { useStrategyDebug } from "@/hooks/useStrategyDebug";
import { Check } from "lucide-react";

export const BriefingResult: React.FC<StrategyBriefingResultProps> = ({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved,
  aiDebugInfo,
  error
}) => {
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [showFinalSuccess, setShowFinalSuccess] = useState<boolean>(false);
  
  // Use our custom hook for saving agent results
  const { saveAgentResult: saveAgentResultToDb } = useAgentResultSaver();
  
  const { isDebugEnabled, setDebugInfo } = useStrategyDebug();
  
  // Update debug info whenever it changes
  React.useEffect(() => {
    if (isDebugEnabled && aiDebugInfo) {
      setDebugInfo(aiDebugInfo);
    }
  }, [isDebugEnabled, aiDebugInfo, setDebugInfo]);

  // Reset success states after a delay
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    let finalTimer: NodeJS.Timeout;
    
    if (showSaveSuccess) {
      saveTimer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 1500);
    }
    
    if (showFinalSuccess) {
      finalTimer = setTimeout(() => {
        setShowFinalSuccess(false);
      }, 1500);
    }
    
    return () => {
      clearTimeout(saveTimer);
      clearTimeout(finalTimer);
    };
  }, [showSaveSuccess, showFinalSuccess]);

  const handleEnhance = () => {
    generateBriefing(enhancementText);
    setEnhancementText("");
  };

  const handleSaveBriefing = async (isFinal: boolean) => {
    if (!latestBriefing?.content) {
      toast.error("No briefing to save");
      return;
    }
    
    try {
      if (isFinal) {
        setIsFinalizing(true);
      } else {
        setIsSaving(true);
      }
      
      await saveAgentResult(latestBriefing.content, isFinal);
      
      if (isFinal) {
        setShowFinalSuccess(true);
      } else {
        setShowSaveSuccess(true);
      }
      
      toast.success(`Briefing saved as ${isFinal ? 'final' : 'draft'}`);
      onBriefingSaved && onBriefingSaved(isFinal);
    } catch (error) {
      console.error("Error saving briefing:", error);
      toast.error("Failed to save briefing");
    } finally {
      setIsSaving(false);
      setIsFinalizing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Latest Briefing</h3>
            {isGenerating && (
              <p className="text-sm text-muted-foreground">
                Generating... {progress}%
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500">
                Error: {error}
              </p>
            )}
          </div>
          
          {latestBriefing ? (
            <div className="prose prose-sm max-w-none">
              {latestBriefing.content}
            </div>
          ) : (
            <p className="text-muted-foreground">No briefing generated yet.</p>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-4">
          <Button 
            onClick={() => handleSaveBriefing(false)}
            disabled={isSaving || isGenerating || !latestBriefing?.content || showSaveSuccess}
            aria-label="Save Briefing"
            className="flex items-center gap-2"
          >
            {showSaveSuccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : null}
            {showSaveSuccess ? "Saved" : (isSaving ? "Saving..." : "Save as Draft")}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => handleSaveBriefing(true)}
            disabled={isFinalizing || isGenerating || !latestBriefing?.content || showFinalSuccess}
            aria-label="Finalize Briefing"
            className="flex items-center gap-2"
          >
            {showFinalSuccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : null}
            {showFinalSuccess ? "Saved" : (isFinalizing ? "Finalizing..." : "Save as Final")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Enhance Briefing</h3>
          <Textarea
            value={enhancementText}
            onChange={(e) => setEnhancementText(e.target.value)}
            placeholder="Enter specific instructions or details to enhance the briefing..."
            className="mb-4"
          />
          <Button 
            onClick={handleEnhance}
            disabled={isGenerating}
            aria-label="Enhance Briefing"
          >
            {isGenerating ? "Generating..." : "Enhance"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Render the debug panel if debug is enabled and we have debug info */}
      {isDebugEnabled && aiDebugInfo && (
        <StrategyDebugPanel 
          debugInfo={aiDebugInfo} 
          title="Briefing AI Debug Information"
        />
      )}
    </div>
  );
};

export default BriefingResult;
