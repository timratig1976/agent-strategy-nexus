
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryTabProps {
  canvasSaveHistory: Array<{timestamp: number, data: any}>;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ canvasSaveHistory }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Canvas History</h3>
      <p className="text-muted-foreground">
        View previous versions of your canvas and restore them if needed.
      </p>
      
      <div className="space-y-4">
        {canvasSaveHistory && canvasSaveHistory.length > 0 ? (
          canvasSaveHistory.map((historyItem, index) => (
            <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Version {canvasSaveHistory.length - index}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(historyItem.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Implement restore functionality later
                  toast.info("Version restored");
                }}
              >
                Restore
              </Button>
            </div>
          ))
        ) : (
          <p>No history available yet. Save your canvas to create history entries.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
