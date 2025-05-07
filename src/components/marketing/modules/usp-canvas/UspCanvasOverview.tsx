
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UspCanvas } from "./types";
import { Bot, User } from "lucide-react";

interface UspCanvasOverviewProps {
  canvas: UspCanvas;
  briefingContent: string;
  personaContent?: string;
}

const UspCanvasOverview = ({ canvas, briefingContent, personaContent }: UspCanvasOverviewProps) => {
  // Count AI-generated vs manually added items
  const aiGeneratedJobs = canvas.customerJobs.filter(job => job.isAIGenerated).length;
  const aiGeneratedPains = canvas.customerPains.filter(pain => pain.isAIGenerated).length;
  const aiGeneratedGains = canvas.customerGains.filter(gain => gain.isAIGenerated).length;
  
  const manualJobs = canvas.customerJobs.length - aiGeneratedJobs;
  const manualPains = canvas.customerPains.length - aiGeneratedPains;
  const manualGains = canvas.customerGains.length - aiGeneratedGains;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Jobs</span>
                <span className="text-sm">{canvas.customerJobs.length}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Bot className="h-3.5 w-3.5 mr-1" />
                  <span>AI Generated</span>
                </div>
                <span>{aiGeneratedJobs}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>Manually Added</span>
                </div>
                <span>{manualJobs}</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Pains</span>
                <span className="text-sm">{canvas.customerPains.length}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Bot className="h-3.5 w-3.5 mr-1" />
                  <span>AI Generated</span>
                </div>
                <span>{aiGeneratedPains}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>Manually Added</span>
                </div>
                <span>{manualPains}</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Gains</span>
                <span className="text-sm">{canvas.customerGains.length}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Bot className="h-3.5 w-3.5 mr-1" />
                  <span>AI Generated</span>
                </div>
                <span>{aiGeneratedGains}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>Manually Added</span>
                </div>
                <span>{manualGains}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Value Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Products & Services</span>
                <span className="text-sm">{canvas.productServices.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pain Relievers</span>
                <span className="text-sm">{canvas.painRelievers.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Gain Creators</span>
                <span className="text-sm">{canvas.gainCreators.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Job-Service Connections</span>
                <span className="text-sm">
                  {canvas.productServices.reduce((total, service) => total + service.relatedJobIds.length, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pain-Reliever Connections</span>
                <span className="text-sm">
                  {canvas.painRelievers.reduce((total, reliever) => total + reliever.relatedPainIds.length, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Gain-Creator Connections</span>
                <span className="text-sm">
                  {canvas.gainCreators.reduce((total, creator) => total + creator.relatedGainIds.length, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Strategy Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {briefingContent && (
            <div>
              <h3 className="text-sm font-medium mb-2">Strategy Briefing</h3>
              <div className="bg-slate-50 p-3 rounded-md text-sm max-h-60 overflow-y-auto">
                {briefingContent}
              </div>
            </div>
          )}
          
          {personaContent && (
            <div>
              <h3 className="text-sm font-medium mb-2">Target Persona</h3>
              <div className="bg-slate-50 p-3 rounded-md text-sm max-h-60 overflow-y-auto">
                {personaContent}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UspCanvasOverview;
