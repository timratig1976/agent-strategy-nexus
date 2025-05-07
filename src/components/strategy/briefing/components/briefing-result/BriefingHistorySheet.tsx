
import React from "react";
import { AgentResult } from "@/types/marketing";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

interface BriefingHistorySheetProps {
  briefingHistory: AgentResult[];
  loadHistoricalVersion: (briefing: AgentResult) => void;
  onSelect?: (content: string) => void; // Added onSelect as an optional prop
}

const BriefingHistorySheet: React.FC<BriefingHistorySheetProps> = ({
  briefingHistory,
  loadHistoricalVersion,
  onSelect
}) => {
  // Helper function to format dates consistently
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

  // Handle the loading of a historical version
  const handleLoadVersion = (briefing: AgentResult) => {
    loadHistoricalVersion(briefing);
    // If onSelect is provided, call it with the briefing content
    if (onSelect) {
      onSelect(briefing.content);
    }
  };

  return (
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
              onClick={() => handleLoadVersion(briefing)}
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
  );
};

export default BriefingHistorySheet;
