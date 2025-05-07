
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentResult } from "@/types/marketing";
import { BriefingProgressBar } from "../BriefingProgressBar";
import { Sparkles, Check, ChevronDown, ChevronUp, History } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import BriefingAIEnhancer from "./BriefingAIEnhancer";
import { BriefingResultProps } from "../../types";

export function BriefingResult({
  latestBriefing,
  isGenerating,
  progress,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory,
  onBriefingSaved
}: BriefingResultProps) {
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
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
    // Pass enhancement text to the generate function if needed
    generateBriefing();
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold">Strategy Briefing</CardTitle>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Version History</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Briefing History</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {briefingHistory.map((briefing, index) => (
                <div key={briefing.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">
                      Version {(briefingHistory.length - index)}
                      {briefing.metadata?.is_final && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Final
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {briefing.createdAt && formatDate(briefing.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {briefing.content.substring(0, 100)}...
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      // Set this version as the current briefing
                      setBriefingHistory(prev => 
                        [briefing, ...prev.filter(b => b.id !== briefing.id)]
                      );
                    }}
                  >
                    Load This Version
                  </Button>
                </div>
              ))}
              
              {briefingHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No history available
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
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
        ) : latestBriefing ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handleToggleExpand}>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="ml-1">{isExpanded ? "Collapse" : "Expand"}</span>
                </Button>
                <span className="text-xs text-muted-foreground">
                  {latestBriefing.createdAt && `Last updated: ${formatDate(latestBriefing.createdAt)}`}
                </span>
              </div>
              <div>
                {latestBriefing.metadata?.is_final && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Final Version
                  </span>
                )}
              </div>
            </div>

            {isExpanded && (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            )}

            <div className="flex justify-between items-center pt-2">
              <Button 
                onClick={handleGenerateBriefing} 
                disabled={isGenerating || isSaving}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Regenerate
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSave(false)} 
                  disabled={isSaving || isGenerating}
                >
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleSave(true)} 
                  disabled={isSaving || isGenerating}
                >
                  {isSaving ? "Saving..." : "Save as Final"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No briefing has been generated yet.</p>
            <Button 
              onClick={handleGenerateBriefing} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate AI Briefing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
