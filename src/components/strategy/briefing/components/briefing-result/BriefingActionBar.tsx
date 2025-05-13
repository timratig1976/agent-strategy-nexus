
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { History } from "lucide-react";
import BriefingHistorySheet from "./BriefingHistorySheet";
import { AgentResult } from "@/types/marketing";

interface BriefingActionBarProps {
  isGenerating: boolean;
  briefingHistory: AgentResult[];
  onSelectHistoricalVersion: (content: string) => void;
  aiDebugInfo: any;
  showPromptMonitor: boolean;
  togglePromptMonitor: () => void;
}

const BriefingActionBar: React.FC<BriefingActionBarProps> = ({
  isGenerating,
  briefingHistory,
  onSelectHistoricalVersion,
  aiDebugInfo,
  showPromptMonitor,
  togglePromptMonitor
}) => {
  return (
    <div className="flex gap-2">
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
      {/* AI Debug button removed from here as it's now in the header */}
    </div>
  );
};

export default BriefingActionBar;
