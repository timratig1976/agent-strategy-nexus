
import React from "react";
import { AgentResult } from "@/types/marketing";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";

interface BriefingHistorySheetProps {
  briefingHistory: AgentResult[];
  loadHistoricalVersion: (briefing: AgentResult) => void;
  onSelect?: (content: string) => void;
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

  // Find the final version in the history
  const finalVersion = briefingHistory.find(briefing => briefing.metadata?.is_final === true);

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Briefing History</SheetTitle>
      </SheetHeader>
      <div className="py-4 space-y-4">
        {/* Display the final version at the top if it exists */}
        {finalVersion && (
          <div className="border-2 border-green-500 rounded-md p-3 bg-green-50">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium flex items-center">
                Final Version
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Final
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {finalVersion.createdAt && formatDate(finalVersion.createdAt)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {finalVersion.content.substring(0, 100)}...
            </p>
            <Button 
              variant="default" 
              size="sm" 
              className="mt-2 bg-green-500 hover:bg-green-600"
              onClick={() => handleLoadVersion(finalVersion)}
            >
              Load Final Version
            </Button>
          </div>
        )}
        
        {/* Display other versions */}
        {briefingHistory.filter(b => !b.metadata?.is_final).map((briefing, index) => (
          <div key={briefing.id} className="border rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">
                Version {(briefingHistory.length - index)}
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
