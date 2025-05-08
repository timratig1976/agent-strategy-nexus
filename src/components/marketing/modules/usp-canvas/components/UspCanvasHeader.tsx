
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface UspCanvasHeaderProps {
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  onSaveFinal: () => void;
}

const UspCanvasHeader: React.FC<UspCanvasHeaderProps> = ({ 
  onNavigateBack, 
  onNavigateNext, 
  onSaveFinal 
}) => {
  return (
    <div className="flex flex-col mb-4 gap-2">
      <h2 className="text-2xl font-bold">Unique Selling Proposition Canvas</h2>
      <p className="text-muted-foreground">
        Define your value proposition by mapping customer jobs, pains, and gains to your products and services.
      </p>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-2">
        <Button 
          variant="outline" 
          onClick={onNavigateBack}
          disabled={!onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Personas
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={onSaveFinal}
            className="flex items-center gap-2"
          >
            Save Final Version
          </Button>
          
          {onNavigateNext && (
            <Button 
              onClick={onNavigateNext}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UspCanvasHeader;
