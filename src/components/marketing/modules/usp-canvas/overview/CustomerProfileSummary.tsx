
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "../types";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CustomerProfileSummaryProps {
  canvas: UspCanvas;
}

const CustomerProfileSummary: React.FC<CustomerProfileSummaryProps> = ({ canvas }) => {
  // Group jobs by priority
  const jobsByPriority = {
    high: canvas.customerJobs.filter(job => job.priority === 'high'),
    medium: canvas.customerJobs.filter(job => job.priority === 'medium'),
    low: canvas.customerJobs.filter(job => job.priority === 'low')
  };
  
  // Group pains by severity
  const painsBySeverity = {
    high: canvas.customerPains.filter(pain => pain.severity === 'high'),
    medium: canvas.customerPains.filter(pain => pain.severity === 'medium'),
    low: canvas.customerPains.filter(pain => pain.severity === 'low')
  };
  
  // Group gains by importance
  const gainsByImportance = {
    high: canvas.customerGains.filter(gain => gain.importance === 'high'),
    medium: canvas.customerGains.filter(gain => gain.importance === 'medium'),
    low: canvas.customerGains.filter(gain => gain.importance === 'low')
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Customer Profile</h3>
        
        <div className="space-y-6">
          {/* Jobs Summary */}
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-2">Customer Jobs</h4>
            <div className="space-y-2">
              {canvas.customerJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No customer jobs defined</p>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">High Priority: {jobsByPriority.high.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-4 w-4">•</span>
                    <span className="text-sm">Medium Priority: {jobsByPriority.medium.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Low Priority: {jobsByPriority.low.length}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Pains Summary */}
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">Customer Pains</h4>
            <div className="space-y-2">
              {canvas.customerPains.length === 0 ? (
                <p className="text-sm text-muted-foreground">No customer pains defined</p>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">High Severity: {painsBySeverity.high.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-4 w-4">•</span>
                    <span className="text-sm">Medium Severity: {painsBySeverity.medium.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Low Severity: {painsBySeverity.low.length}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Gains Summary */}
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">Customer Gains</h4>
            <div className="space-y-2">
              {canvas.customerGains.length === 0 ? (
                <p className="text-sm text-muted-foreground">No customer gains defined</p>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">High Importance: {gainsByImportance.high.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-4 w-4">•</span>
                    <span className="text-sm">Medium Importance: {gainsByImportance.medium.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Low Importance: {gainsByImportance.low.length}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProfileSummary;
