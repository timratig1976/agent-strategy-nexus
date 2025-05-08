
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Strategy } from "@/types/marketing";

interface FunnelStrategyModuleProps {
  strategy: Strategy;
  onNavigateBack: () => void;
}

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({
  strategy,
  onNavigateBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Funnel Strategy</h2>
        <Button 
          variant="outline" 
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to USP Canvas
        </Button>
      </div>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-lg font-medium text-blue-800">Funnel Strategy Development</h3>
        <p className="text-blue-700 mt-2">
          This is where you'll develop your marketing funnel strategy based on your USP canvas and personas.
        </p>
      </div>
    </div>
  );
};

export default FunnelStrategyModule;
