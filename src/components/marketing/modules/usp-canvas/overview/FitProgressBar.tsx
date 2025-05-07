
import React from "react";
import { Progress } from "@/components/ui/progress";

interface FitProgressBarProps {
  label: string;
  percentage: number;
}

const FitProgressBar: React.FC<FitProgressBarProps> = ({ label, percentage }) => {
  // Ensure percentage is a valid number between 0 and 100
  const validPercentage = Math.min(Math.max(isNaN(percentage) ? 0 : percentage, 0), 100);
  
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
        <span className="text-sm font-medium">{validPercentage}%</span>
      </div>
      <Progress 
        value={validPercentage} 
        className={`h-2 ${getProgressColor(validPercentage)}`}
      />
    </div>
  );
};

export default FitProgressBar;
