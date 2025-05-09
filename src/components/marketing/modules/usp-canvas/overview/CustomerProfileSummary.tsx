
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UspCanvas } from "../types";
import { CircleCheck, CircleAlert } from "lucide-react";

interface CustomerProfileSummaryProps {
  canvas: UspCanvas;
}

const CustomerProfileSummary: React.FC<CustomerProfileSummaryProps> = ({ canvas }) => {
  // Count items by priority/severity/importance
  const jobsByPriority = {
    high: canvas.customerJobs.filter(job => job.priority === 'high').length,
    medium: canvas.customerJobs.filter(job => job.priority === 'medium').length,
    low: canvas.customerJobs.filter(job => job.priority === 'low').length,
  };
  
  const painsBySeverity = {
    high: canvas.customerPains.filter(pain => pain.severity === 'high').length,
    medium: canvas.customerPains.filter(pain => pain.severity === 'medium').length,
    low: canvas.customerPains.filter(pain => pain.severity === 'low').length,
  };
  
  const gainsByImportance = {
    high: canvas.customerGains.filter(gain => gain.importance === 'high').length,
    medium: canvas.customerGains.filter(gain => gain.importance === 'medium').length,
    low: canvas.customerGains.filter(gain => gain.importance === 'low').length,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Customer Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Customer Jobs ({canvas.customerJobs.length})</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-blue-700">{jobsByPriority.high}</div>
              <div className="text-xs text-blue-600">High Priority</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-blue-700">{jobsByPriority.medium}</div>
              <div className="text-xs text-blue-600">Medium Priority</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-blue-700">{jobsByPriority.low}</div>
              <div className="text-xs text-blue-600">Low Priority</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Customer Pains ({canvas.customerPains.length})</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-red-700">{painsBySeverity.high}</div>
              <div className="text-xs text-red-600">High Severity</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-red-700">{painsBySeverity.medium}</div>
              <div className="text-xs text-red-600">Medium Severity</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-red-700">{painsBySeverity.low}</div>
              <div className="text-xs text-red-600">Low Severity</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Customer Gains ({canvas.customerGains.length})</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-green-700">{gainsByImportance.high}</div>
              <div className="text-xs text-green-600">High Importance</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-green-700">{gainsByImportance.medium}</div>
              <div className="text-xs text-green-600">Medium Importance</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-green-700">{gainsByImportance.low}</div>
              <div className="text-xs text-green-600">Low Importance</div>
            </div>
          </div>
        </div>
        
        {canvas.customerJobs.length === 0 && canvas.customerPains.length === 0 && canvas.customerGains.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md border-gray-300">
            <CircleAlert className="h-10 w-10 text-amber-500 mb-2" />
            <p className="text-sm text-muted-foreground text-center">No customer profile data available</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CircleCheck className="h-4 w-4" />
            <span>Customer profile complete</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerProfileSummary;
