
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowUpDown, FileText, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BriefingContentEditor } from './BriefingContentEditor';
import { BriefingHistorySheet } from './BriefingHistorySheet';
import { BriefingAIEnhancer } from './BriefingAIEnhancer';
import PromptMonitor from '../PromptMonitor';
import { AgentResult } from '@/types/marketing';

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
  aiDebugInfo
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [enhancementText, setEnhancementText] = useState<string>("");
  
  // Get the latest briefing from history if available
  const briefingContent = latestBriefing?.content || "";
  
  // Check if this briefing is marked as final
  const isFinalBriefing = latestBriefing?.metadata?.is_final === true;
  
  // Handle save click
  const handleSave = async (markAsFinal: boolean = false) => {
    if (!editedContent.trim()) {
      toast.error("Cannot save empty content");
      return;
    }
    
    setIsSaving(true);
    try {
      await saveAgentResult(editedContent, markAsFinal);
      toast.success(markAsFinal ? "Briefing finalized" : "Briefing saved");
      if (onBriefingSaved) {
        onBriefingSaved(markAsFinal);
      }
    } catch (error) {
      console.error("Error saving briefing:", error);
      toast.error("Failed to save briefing");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle regenerate click
  const handleRegenerate = () => {
    generateBriefing(enhancementText || undefined);
    setEnhancementText("");
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Strategy Briefing</CardTitle>
          <div className="flex items-center space-x-2">
            {aiDebugInfo && (
              <PromptMonitor 
                debugInfo={aiDebugInfo} 
                isError={false}
              />
            )}
            {briefingHistory.length > 0 && (
              <BriefingHistorySheet 
                briefingHistory={briefingHistory} 
                setBriefingHistory={setBriefingHistory}
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <BriefingContentEditor 
            content={briefingContent}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            isGenerating={isGenerating}
            progress={progress}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            {briefingContent && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSave(false)}
                disabled={isSaving || isGenerating}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {briefingContent && !isFinalBriefing && (
              <Button 
                variant="default"
                size="sm"
                onClick={() => handleSave(true)}
                disabled={isSaving || isGenerating}
                title="Mark as final"
              >
                {isSaving ? "Saving..." : "Finalize Briefing"}
              </Button>
            )}
            
            <Button
              variant={briefingContent ? "outline" : "default"}
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : briefingContent ? "Regenerate" : "Generate Briefing"}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <BriefingAIEnhancer 
        enhancementText={enhancementText}
        setEnhancementText={setEnhancementText}
      />
    </div>
  );
};
