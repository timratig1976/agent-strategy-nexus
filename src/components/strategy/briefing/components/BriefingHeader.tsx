
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BriefingHeaderProps {
  hasFinalBriefing: boolean;
  goToNextStep: () => void;
}

const BriefingHeader: React.FC<BriefingHeaderProps> = ({
  hasFinalBriefing,
  goToNextStep
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Strategy Briefing</h2>
      <Button 
        onClick={goToNextStep}
        className="flex items-center"
        disabled={!hasFinalBriefing}
      >
        Next: Persona Development <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

export default BriefingHeader;
