
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Strategy } from "@/types/marketing";

interface AdCampaignModuleProps {
  strategy: Strategy;
  onNavigateBack: () => void;
}

const AdCampaignModule: React.FC<AdCampaignModuleProps> = ({
  strategy,
  onNavigateBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Campaign Strategy</h2>
        <Button 
          variant="outline" 
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Funnel Strategy
        </Button>
      </div>
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
        <h3 className="text-lg font-medium text-purple-800">Ad Campaign Development</h3>
        <p className="text-purple-700 mt-2">
          This is where you'll develop your ad campaigns based on your marketing funnel strategy.
        </p>
      </div>
    </div>
  );
};

export default AdCampaignModule;
