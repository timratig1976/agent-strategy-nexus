
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PersonaHeaderProps {
  title: string;
  hasFinalPersona: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

export const PersonaHeader: React.FC<PersonaHeaderProps> = ({
  title,
  hasFinalPersona,
  onPreviousStep,
  onNextStep
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onPreviousStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Briefing
        </Button>
        {hasFinalPersona && (
          <Button
            onClick={onNextStep}
            className="flex items-center gap-2"
          >
            Next Step <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
