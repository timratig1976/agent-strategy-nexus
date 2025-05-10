
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FunnelHeaderProps {
  onNavigateBack?: () => void;
  isNavigatingBack?: boolean;
}

const FunnelHeader: React.FC<FunnelHeaderProps> = ({ 
  onNavigateBack,
  isNavigatingBack = false 
}) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Marketing Funnel Strategy</CardTitle>
        
        {onNavigateBack && (
          <Button 
            variant="outline" 
            onClick={onNavigateBack}
            disabled={isNavigatingBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to USP Canvas
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default FunnelHeader;
