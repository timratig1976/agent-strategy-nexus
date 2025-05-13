
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Save, ArrowRight, Check } from 'lucide-react';

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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);
  
  // Reset success states after a delay
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    let finalTimer: NodeJS.Timeout;
    
    if (showSaveSuccess) {
      saveTimer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 1500);
    }
    
    if (showFinalSuccess) {
      finalTimer = setTimeout(() => {
        setShowFinalSuccess(false);
      }, 1500);
    }
    
    return () => {
      clearTimeout(saveTimer);
      clearTimeout(finalTimer);
    };
  }, [showSaveSuccess, showFinalSuccess]);
  
  const handleSave = () => {
    onSave();
    setShowSaveSuccess(true);
  };
  
  const handleSaveFinal = () => {
    onSaveFinal();
    setShowFinalSuccess(true);
  };

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
          onClick={handleSave}
          disabled={isSaving || !hasChanges || showSaveSuccess}
          className="flex items-center gap-2"
        >
          {showSaveSuccess ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {showSaveSuccess ? "Saved" : "Save as Draft"}
        </Button>
        
        <Button
          variant="default"
          onClick={handleSaveFinal}
          disabled={isSaving || (!hasChanges && !canContinue) || showFinalSuccess}
          className="flex items-center gap-2"
        >
          {showFinalSuccess ? (
            <Check className="h-4 w-4" />
          ) : null}
          {showFinalSuccess ? "Saved" : "Save Final Version"}
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
