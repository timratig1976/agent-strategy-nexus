
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface UspCanvasHeaderProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  onSaveFinal: () => void;
  isFinalSaved?: boolean;
  prevStageLabel?: string;
  nextStageLabel?: string;
}

const UspCanvasHeader: React.FC<UspCanvasHeaderProps> = ({ 
  onNavigateBack, 
  onNavigateNext, 
  onSaveFinal,
  isFinalSaved = false,
  prevStageLabel = "Back to Personas",
  nextStageLabel = "Next"
}) => {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Reset success state after a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showSaveSuccess) {
      timer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 1500);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [showSaveSuccess]);
  
  const handleSaveFinal = () => {
    onSaveFinal();
    setShowSaveSuccess(true);
  };

  return (
    <div className="flex flex-col mb-4 gap-2">
      <h2 className="text-2xl font-bold">Unique Selling Proposition Canvas</h2>
      <p className="text-muted-foreground">
        Define your value proposition by mapping customer jobs, pains, and gains to your products and services.
      </p>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-2">
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
        
        <div className="flex gap-2 ml-auto">
          <Button 
            onClick={handleSaveFinal}
            className="flex items-center gap-2"
            disabled={isFinalSaved || showSaveSuccess}
          >
            {showSaveSuccess || isFinalSaved ? (
              <Check className="h-4 w-4" />
            ) : null}
            {showSaveSuccess ? "Saved" : (isFinalSaved ? 'Final Version Saved' : 'Save Final Version')}
          </Button>
          
          {onNavigateNext && (
            <Button 
              onClick={onNavigateNext}
              variant={isFinalSaved ? "default" : "outline"}
              disabled={!isFinalSaved}
              className="flex items-center gap-2"
            >
              {nextStageLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UspCanvasHeader;
