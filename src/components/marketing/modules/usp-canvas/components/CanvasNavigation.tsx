
import React from 'react';
import { Button } from '@/components/ui/button';

interface CanvasNavigationProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  prevStageLabel?: string;
  nextStageLabel?: string;
  onFinalize?: () => Promise<void>;
  canFinalize?: boolean;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  onNavigateBack,
  onNavigateNext,
  prevStageLabel = "Back",
  nextStageLabel = "Next",
  onFinalize,
  canFinalize = true,
}) => {
  return (
    <div className="flex justify-between mt-8 pb-8">
      {onNavigateBack && (
        <Button 
          variant="outline"
          onClick={onNavigateBack}
          size="lg"
        >
          {prevStageLabel}
        </Button>
      )}
      
      <div className="flex gap-3">
        {onFinalize && (
          <Button 
            variant="secondary"
            onClick={onFinalize}
            size="lg"
            disabled={!canFinalize}
          >
            Finalize & Save
          </Button>
        )}
        
        {onNavigateNext && (
          <Button 
            onClick={onNavigateNext}
            size="lg"
          >
            {nextStageLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CanvasNavigation;
