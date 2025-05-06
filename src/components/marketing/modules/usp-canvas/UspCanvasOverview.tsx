
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "./types";

interface UspCanvasOverviewProps {
  canvas: UspCanvas;
}

const UspCanvasOverview = ({ canvas }: UspCanvasOverviewProps) => {
  // Helper function to count items with high priority/severity/importance
  const countHighPriorityItems = (
    items: Array<{ priority?: 'low' | 'medium' | 'high', severity?: 'low' | 'medium' | 'high', importance?: 'low' | 'medium' | 'high' }>,
    propertyName: 'priority' | 'severity' | 'importance'
  ) => {
    return items.filter(item => item[propertyName] === 'high').length;
  };

  // Calculate connection percentages
  const calculateConnectionPercentage = (
    sourceItems: Array<{ id: string }>,
    targetItems: Array<{ relatedJobIds?: string[], relatedPainIds?: string[], relatedGainIds?: string[] }>,
    relationProperty: 'relatedJobIds' | 'relatedPainIds' | 'relatedGainIds'
  ) => {
    if (sourceItems.length === 0) return 0;
    
    const connectedSourceIds = new Set<string>();
    
    targetItems.forEach(target => {
      const relatedIds = target[relationProperty] || [];
      relatedIds.forEach(id => connectedSourceIds.add(id));
    });
    
    return Math.round((connectedSourceIds.size / sourceItems.length) * 100);
  };

  const jobConnectionPercentage = calculateConnectionPercentage(
    canvas.customerJobs, 
    canvas.productServices, 
    'relatedJobIds'
  );

  const painConnectionPercentage = calculateConnectionPercentage(
    canvas.customerPains, 
    canvas.painRelievers, 
    'relatedPainIds'
  );

  const gainConnectionPercentage = calculateConnectionPercentage(
    canvas.customerGains, 
    canvas.gainCreators, 
    'relatedGainIds'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Canvas Overview & Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Value Map</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Products & Services</span>
                  <span className="font-medium">{canvas.productServices.length}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pain Relievers</span>
                  <span className="font-medium">{canvas.painRelievers.length}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gain Creators</span>
                  <span className="font-medium">{canvas.gainCreators.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Value Proposition Fit</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Product-Job Fit</span>
                <span className="text-sm font-medium">{jobConnectionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    jobConnectionPercentage < 30 ? 'bg-red-500' : 
                    jobConnectionPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${jobConnectionPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {jobConnectionPercentage < 30 ? 'Poor fit - more connections needed' : 
                 jobConnectionPercentage < 70 ? 'Moderate fit - consider adding more connections' : 
                 'Good fit between products and customer jobs'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Pain-Reliever Fit</span>
                <span className="text-sm font-medium">{painConnectionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    painConnectionPercentage < 30 ? 'bg-red-500' : 
                    painConnectionPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${painConnectionPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {painConnectionPercentage < 30 ? 'Poor fit - more connections needed' : 
                 painConnectionPercentage < 70 ? 'Moderate fit - consider adding more connections' : 
                 'Good fit between pain relievers and customer pains'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Gain-Creator Fit</span>
                <span className="text-sm font-medium">{gainConnectionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    gainConnectionPercentage < 30 ? 'bg-red-500' : 
                    gainConnectionPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${gainConnectionPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {gainConnectionPercentage < 30 ? 'Poor fit - more connections needed' : 
                 gainConnectionPercentage < 70 ? 'Moderate fit - consider adding more connections' : 
                 'Good fit between gain creators and customer gains'}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
              <p className="font-medium">Value Proposition Fit Assessment</p>
              <p className="mt-1">
                {(jobConnectionPercentage + painConnectionPercentage + gainConnectionPercentage) / 3 < 40 ? 
                  'Your value proposition needs significant improvement. Focus on better connecting your offerings to customer needs.' : 
                  (jobConnectionPercentage + painConnectionPercentage + gainConnectionPercentage) / 3 < 70 ?
                  'Your value proposition has moderate fit. Continue refining connections between what you offer and what customers need.' :
                  'Your value proposition shows good fit! You\'ve established strong connections between your offerings and customer needs.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UspCanvasOverview;
