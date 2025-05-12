
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface CanvasNavigationProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  onFinalize?: () => void;
  onSaveFinal?: () => void;
  canFinalize?: boolean;
  isSaved?: boolean;
  prevStageLabel?: string;
  nextStageLabel?: string;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  onNavigateBack,
  onNavigateNext,
  onFinalize,
  onSaveFinal,
  canFinalize = true,
  isSaved = false,
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
        {onSaveFinal && (
          <Button
            variant="default"
            onClick={onSaveFinal}
            disabled={isSaved}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaved ? 'Final Version Saved' : 'Save Final Version'}
          </Button>
        )}
        
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
