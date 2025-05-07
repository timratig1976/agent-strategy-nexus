
import React from "react";
import { Progress } from "@/components/ui/progress";

interface FitProgressBarProps {
  label: string;
  percentage: number;
}

const FitProgressBar: React.FC<FitProgressBarProps> = ({ label, percentage }) => {
  // Determine color based on percentage
  const getProgressColor = (value: number): string => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className={`h-2 ${getProgressColor(percentage)}`}
      />
    </div>
  );
};

export default FitProgressBar;
