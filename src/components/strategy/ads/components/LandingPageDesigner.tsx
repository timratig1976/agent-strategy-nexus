
import React from "react";
import { Button } from "@/components/ui/button"; // Fixed import path
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LandingPageDesignerProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  strategyId: string;
  isLoading: boolean;
}

const LandingPageDesigner: React.FC<LandingPageDesignerProps> = ({
  campaignData,
  onSaveCampaign,
  strategyId,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading landing page designer...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Landing Page Designer</h3>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Landing page designer will be implemented here. This section will allow you to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Create optimized landing pages for your campaigns</li>
            <li>Choose from professionally designed templates</li>
            <li>Customize copy, images, and CTAs based on your ad campaigns</li>
            <li>Preview landing pages across desktop and mobile devices</li>
            <li>Generate and export HTML/CSS code for your landing pages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPageDesigner;
