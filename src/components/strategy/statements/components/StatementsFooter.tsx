
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Save, ArrowRight } from 'lucide-react';

interface StatementsFooterProps {
  onSave: () => void;
  onSaveFinal: () => void;
  onContinue: () => void; 
  isSaving?: boolean;
  hasChanges?: boolean;
  isNavigating?: boolean;
  canContinue?: boolean;
}

const StatementsFooter: React.FC<StatementsFooterProps> = ({
  onSave,
  onSaveFinal,
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
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        
        <Button
          variant="default"
          onClick={onSaveFinal}
          disabled={isSaving || (!hasChanges && !canContinue)}
        >
          Save Final Version
        </Button>
        
        <Button
          onClick={onContinue}
          disabled={isNavigating || !canContinue || hasChanges}
          className="flex items-center gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StatementsFooter;
