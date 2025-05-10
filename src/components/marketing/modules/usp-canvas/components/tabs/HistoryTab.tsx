
import React from "react";
import { CanvasHistoryEntry } from "../../types";
import { Button } from "@/components/ui/button";
import { Check, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface HistoryTabProps {
  canvasSaveHistory: CanvasHistoryEntry[];
  onRefresh: () => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ canvasSaveHistory, onRefresh }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Canvas History</h2>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {canvasSaveHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No history available for this canvas. Save your changes to create history entries.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {canvasSaveHistory.map((entry, index) => (
            <Card key={index} className={entry.isFinal ? "border-green-500" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                  {entry.isFinal && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Final Version
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="text-xs text-muted-foreground">
                  <p>
                    Customer Jobs: {entry.data.customerJobs.length} items
                    {entry.data.customerJobs.length > 0 && ` (${entry.data.customerJobs.slice(0, 2).map(job => job.content.substring(0, 20)).join(", ")}${entry.data.customerJobs.length > 2 ? "..." : ""})`}
                  </p>
                  <p>
                    Customer Pains: {entry.data.customerPains.length} items
                    {entry.data.customerPains.length > 0 && ` (${entry.data.customerPains.slice(0, 2).map(pain => pain.content.substring(0, 20)).join(", ")}${entry.data.customerPains.length > 2 ? "..." : ""})`}
                  </p>
                  <p>
                    Customer Gains: {entry.data.customerGains.length} items
                    {entry.data.customerGains.length > 0 && ` (${entry.data.customerGains.slice(0, 2).map(gain => gain.content.substring(0, 20)).join(", ")}${entry.data.customerGains.length > 2 ? "..." : ""})`}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                  // This would restore this version in a real implementation
                  onClick={() => console.log('Restore version from:', entry.timestamp)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
