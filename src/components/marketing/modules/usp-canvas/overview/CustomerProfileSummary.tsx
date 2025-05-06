
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "../types";

interface CustomerProfileSummaryProps {
  canvas: UspCanvas;
}

const CustomerProfileSummary = ({ canvas }: CustomerProfileSummaryProps) => {
  // Helper function to count items with high priority/severity/importance
  const countHighPriorityItems = (
    items: Array<{ priority?: 'low' | 'medium' | 'high', severity?: 'low' | 'medium' | 'high', importance?: 'low' | 'medium' | 'high' }>,
    propertyName: 'priority' | 'severity' | 'importance'
  ) => {
    return items.filter(item => item[propertyName] === 'high').length;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Customer Profile</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer Jobs</span>
              <span className="font-medium">{canvas.customerJobs.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Including {countHighPriorityItems(canvas.customerJobs, 'priority')} high priority jobs
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer Pains</span>
              <span className="font-medium">{canvas.customerPains.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Including {countHighPriorityItems(canvas.customerPains, 'severity')} high severity pains
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer Gains</span>
              <span className="font-medium">{canvas.customerGains.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Including {countHighPriorityItems(canvas.customerGains, 'importance')} high importance gains
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProfileSummary;
