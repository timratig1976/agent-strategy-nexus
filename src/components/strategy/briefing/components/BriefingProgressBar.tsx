
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface BriefingProgressBarProps {
  progress: number;
}

export const BriefingProgressBar: React.FC<BriefingProgressBarProps> = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Generating AI Briefing</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BriefingProgressBar;
