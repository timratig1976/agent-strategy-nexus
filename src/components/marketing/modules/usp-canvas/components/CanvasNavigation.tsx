
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CanvasNavigationProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  onFinalize?: () => void;
  canFinalize?: boolean;
  prevStageLabel?: string;
  nextStageLabel?: string;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  onNavigateBack,
  onNavigateNext,
  onFinalize,
  canFinalize = true,
  prevStageLabel = 'Back to Previous Step',
  nextStageLabel = 'Continue to Next Step'
}) => {
  return (
    <div className="flex justify-between items-center mt-6 px-4">
      {onNavigateBack && (
        <Button
          variant="outline"
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {prevStageLabel}
        </Button>
      )}

      <div className="ml-auto flex gap-2">
        {onFinalize && (
          <Button
            variant="default"
            onClick={onFinalize}
            disabled={!canFinalize}
            className="flex items-center gap-2"
          >
            {nextStageLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        
        {/* If there's no finalize function but there is next navigation */}
        {!onFinalize && onNavigateNext && (
          <Button
            variant="default"
            onClick={onNavigateNext}
            className="flex items-center gap-2"
          >
            {nextStageLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CanvasNavigation;
