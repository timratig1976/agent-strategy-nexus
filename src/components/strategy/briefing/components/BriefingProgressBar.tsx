
import React from "react";
import { Progress } from "@/components/ui/progress";

interface BriefingProgressBarProps {
  progress: number;
}

const BriefingProgressBar: React.FC<BriefingProgressBarProps> = ({ progress }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2 text-sm">
        <span>Generating AI briefing...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default BriefingProgressBar;
