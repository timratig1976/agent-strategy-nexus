
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { AgentResult } from "@/types/marketing";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";

interface BriefingHistorySheetProps {
  briefingHistory: AgentResult[];
  onSelectHistoricalVersion: (content: string) => void;
}

const BriefingHistorySheet: React.FC<BriefingHistorySheetProps> = ({
  briefingHistory,
  onSelectHistoricalVersion
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle>Briefing History</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {briefingHistory.length === 0 ? (
            <p className="text-muted-foreground text-center">No historical versions found</p>
          ) : (
            briefingHistory.map((item, index) => (
              <div 
                key={item.id} 
                className="border rounded-md p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSelectHistoricalVersion(item.content)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">
                    Version {briefingHistory.length - index}
                    {item.metadata?.is_final && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Final
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.content.substring(0, 150)}...
                </p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BriefingHistorySheet;
