
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CanvasNavigationProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  prevStageLabel?: string;
  nextStageLabel?: string;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  onNavigateBack,
  onNavigateNext,
  prevStageLabel = 'Back',
  nextStageLabel = 'Next'
}) => {
  if (!onNavigateBack && !onNavigateNext) return null;
  
  return (
    <div className="flex justify-between mt-8 pt-4 border-t">
      {onNavigateBack && (
        <Button
          onClick={onNavigateBack}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {prevStageLabel}
        </Button>
      )}
      {onNavigateNext && (
        <Button onClick={onNavigateNext}>
          {nextStageLabel}
        </Button>
      )}
    </div>
  );
};

export default CanvasNavigation;
