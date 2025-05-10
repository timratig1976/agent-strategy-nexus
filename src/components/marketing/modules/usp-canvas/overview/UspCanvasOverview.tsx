
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UspCanvas } from "../types";
import { CustomerProfileSummary, ValueMapSummary, ValuePropositionFit, FitProgressBar } from "./index";

interface UspCanvasOverviewProps {
  canvas: UspCanvas;
  briefingContent?: string;
  personaContent?: string;
}

const UspCanvasOverview: React.FC<UspCanvasOverviewProps> = ({ canvas, briefingContent = "", personaContent = "" }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Value Proposition Canvas Overview</h2>
      <p className="text-muted-foreground mb-6">
        This overview shows how your products and services address the jobs, pains, and gains of your customers.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ValueMapSummary canvas={canvas} />
        </div>
        
        <div className="lg:col-span-1">
          <ValuePropositionFit canvas={canvas} />
        </div>
        
        <div className="lg:col-span-1">
          <CustomerProfileSummary canvas={canvas} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Value Proposition Canvas Diagram</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="relative w-full max-w-3xl flex">
            {/* Value Map (Square) */}
            <div className="w-1/2 border-2 rounded-l-lg p-4 bg-blue-50">
              <h3 className="text-center font-semibold mb-4">Value Map</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Products & Services</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.productServices.slice(0, 3).map((service, idx) => (
                      <li key={idx}>{service.content}</li>
                    ))}
                    {canvas.productServices.length > 3 && (
                      <li>+{canvas.productServices.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Pain Relievers</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.painRelievers.slice(0, 3).map((reliever, idx) => (
                      <li key={idx}>{reliever.content}</li>
                    ))}
                    {canvas.painRelievers.length > 3 && (
                      <li>+{canvas.painRelievers.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Gain Creators</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.gainCreators.slice(0, 3).map((creator, idx) => (
                      <li key={idx}>{creator.content}</li>
                    ))}
                    {canvas.gainCreators.length > 3 && (
                      <li>+{canvas.gainCreators.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Customer Profile (Circle) */}
            <div className="w-1/2 border-2 rounded-r-lg p-4 bg-green-50">
              <h3 className="text-center font-semibold mb-4">Customer Profile</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Customer Jobs</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.customerJobs.slice(0, 3).map((job, idx) => (
                      <li key={idx}>{job.content}</li>
                    ))}
                    {canvas.customerJobs.length > 3 && (
                      <li>+{canvas.customerJobs.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Customer Pains</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.customerPains.slice(0, 3).map((pain, idx) => (
                      <li key={idx}>{pain.content}</li>
                    ))}
                    {canvas.customerPains.length > 3 && (
                      <li>+{canvas.customerPains.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md">
                  <h4 className="font-medium text-sm">Customer Gains</h4>
                  <ul className="mt-2 text-xs space-y-1">
                    {canvas.customerGains.slice(0, 3).map((gain, idx) => (
                      <li key={idx}>{gain.content}</li>
                    ))}
                    {canvas.customerGains.length > 3 && (
                      <li>+{canvas.customerGains.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Context Information Section if briefing or persona content exists */}
      {(briefingContent || personaContent) && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {briefingContent && (
              <div>
                <h3 className="text-sm font-medium mb-2">Strategy Briefing</h3>
                <div className="bg-slate-50 p-3 rounded-md text-sm max-h-60 overflow-y-auto">
                  {briefingContent}
                </div>
              </div>
            )}
            
            {personaContent && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Target Persona</h3>
                <div className="bg-slate-50 p-3 rounded-md text-sm max-h-60 overflow-y-auto">
                  {personaContent}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UspCanvasOverview;
