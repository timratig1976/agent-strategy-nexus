
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { History, Sparkles } from "lucide-react";
import BriefingHistorySheet from "./BriefingHistorySheet";
import { AgentResult } from "@/types/marketing";

interface BriefingActionBarProps {
  isGenerating: boolean;
  generateButtonText: string;
  onGenerate: () => void;
  briefingHistory: AgentResult[];
  onSelectHistoricalVersion: (content: string) => void;
  aiDebugInfo: any;
  showPromptMonitor: boolean;
  togglePromptMonitor: () => void;
}

const BriefingActionBar: React.FC<BriefingActionBarProps> = ({
  isGenerating,
  generateButtonText,
  onGenerate,
  briefingHistory,
  onSelectHistoricalVersion,
  aiDebugInfo,
  showPromptMonitor,
  togglePromptMonitor
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="flex gap-1"
      >
        <Sparkles className="h-4 w-4" /> 
        {isGenerating ? "Generating..." : generateButtonText}
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1">
            <History className="h-4 w-4" /> History
          </Button>
        </SheetTrigger>
        <BriefingHistorySheet
          briefingHistory={briefingHistory}
          loadHistoricalVersion={(briefing) => onSelectHistoricalVersion(briefing.content)}
          onSelect={(content) => onSelectHistoricalVersion(content)}
        />
      </Sheet>
      {aiDebugInfo && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={togglePromptMonitor}
        >
          {showPromptMonitor ? "Hide AI Log" : "Show AI Log"}
        </Button>
      )}
    </div>
  );
};

export default BriefingActionBar;
