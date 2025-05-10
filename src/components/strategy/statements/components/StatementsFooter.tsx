
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatementsFooterProps {
  onSave: () => void;
  onContinue: () => void; 
  isSaving?: boolean;
  hasChanges?: boolean;
  isNavigating?: boolean;
  canContinue?: boolean;
}

const StatementsFooter: React.FC<StatementsFooterProps> = ({
  onSave,
  onContinue,
  isSaving = false,
  hasChanges = false,
  isNavigating = false,
  canContinue = true
}) => {
  return (
    <div className={cn(
      "flex justify-between items-center p-6 bg-gray-50 border-t",
      hasChanges ? "bg-amber-50" : ""
    )}>
      {hasChanges && (
        <div className="text-amber-700 text-sm">
          You have unsaved changes
        </div>
      )}
      {!hasChanges && (
        <div></div>
      )}
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : "Save Statements"}
        </Button>
        
        <Button
          onClick={onContinue}
          disabled={isNavigating || !canContinue || hasChanges}
        >
          {isNavigating ? "Navigating..." : "Continue to Funnel Strategy"}
        </Button>
      </div>
    </div>
  );
};

export default StatementsFooter;
