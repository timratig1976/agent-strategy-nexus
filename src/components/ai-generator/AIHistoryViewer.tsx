
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";
import { AIGenerationResult, AIHistoryViewerProps } from "./types";

/**
 * Format a date safely, handling potential null values and different date types
 */
function formatDate(dateValue: string | Date | null | undefined): string | null {
  if (!dateValue) {
    return null;
  }
  
  try {
    // Convert to Date object if it's a string
    const dateObj = typeof dateValue === 'string' 
      ? new Date(dateValue)
      : dateValue;
      
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
}

/**
 * Component for viewing and selecting from generation history
 */
const AIHistoryViewer = <T extends AIGenerationResult>({
  generationHistory,
  onSelectHistoricalVersion,
  title = "Generation History"
}: AIHistoryViewerProps<T>) => {
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
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {generationHistory.length === 0 ? (
            <p className="text-muted-foreground text-center">No historical versions found</p>
          ) : (
            generationHistory.map((item, index) => (
              <div 
                key={item.id || index} 
                className="border rounded-md p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSelectHistoricalVersion(item.content)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">
                    Version {generationHistory.length - index}
                    {item.metadata?.is_final && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Final
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
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

export default AIHistoryViewer;
