
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FunnelActionPlanProps {
  funnelData: any;
  onSaveFunnel: (data: any) => void;
  onFinalize: () => void;
  isFinalized: boolean;
  isLoading: boolean;
}

const FunnelActionPlan: React.FC<FunnelActionPlanProps> = ({
  funnelData,
  onSaveFunnel,
  onFinalize,
  isFinalized,
  isLoading
}) => {
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading action plan...</span>
      </div>
    );
  }
  
  if (!funnelData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No funnel data available. Please configure your funnel or use the AI Generator first.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const defaultActionItems = [
    {
      title: "Create awareness content",
      description: "Develop blog posts, social media content, and SEO strategy",
      timeframe: "Weeks 1-2"
    },
    {
      title: "Set up lead magnet",
      description: "Create a valuable resource for lead generation",
      timeframe: "Weeks 2-3"
    },
    {
      title: "Implement email nurture sequence",
      description: "Develop an email series to move prospects through the funnel",
      timeframe: "Weeks 3-4"
    },
    {
      title: "Optimize landing pages",
      description: "Ensure all landing pages are optimized for conversion",
      timeframe: "Weeks 4-5"
    },
    {
      title: "Set up tracking and analytics",
      description: "Implement tracking to measure funnel performance",
      timeframe: "Week 6"
    }
  ];
  
  const actionItems = funnelData.actionItems || defaultActionItems;
  
  return (
    <div className="space-y-6">
      {isFinalized && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            This funnel strategy has been finalized. You can now proceed to the Ad Campaign stage.
          </AlertDescription>
        </Alert>
      )}
      
      {showFinalizeConfirm && !isFinalized && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <FileText className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-600 flex items-center justify-between">
            <span>Are you sure you want to finalize this funnel strategy? You can still make changes after finalizing.</span>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFinalizeConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={onFinalize}
              >
                Confirm
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Funnel Implementation Plan</h3>
        {!isFinalized && !showFinalizeConfirm && (
          <Button onClick={() => setShowFinalizeConfirm(true)}>
            Finalize Funnel Strategy
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {actionItems.map((item, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {item.timeframe}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FunnelActionPlan;
