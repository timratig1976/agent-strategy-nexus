
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface BriefingProgressBarProps {
  progress: number;
}

export const BriefingProgressBar: React.FC<BriefingProgressBarProps> = ({ progress }) => {
  return (
    <div className="mb-6">
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BriefingProgressBar;
