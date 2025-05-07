
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface FitProgressBarProps {
  label: string;
  percentage: number;
}

const FitProgressBar = ({ label, percentage }: FitProgressBarProps) => {
  // Determine the color based on percentage
  const getProgressColor = (value: number): string => {
    if (value < 30) return 'bg-red-500';
    if (value < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Determine the status label based on percentage
  const getStatusLabel = (value: number): string => {
    if (value < 30) return 'Poor fit';
    if (value < 70) return 'Moderate fit';
    return 'Strong fit';
  };

  const progressColor = getProgressColor(percentage);
  const statusLabel = getStatusLabel(percentage);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className={`h-2 ${progressColor}`} 
        />
      </div>
      <div className="flex justify-end">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          percentage < 30 ? 'bg-red-100 text-red-800' :
          percentage < 70 ? 'bg-amber-100 text-amber-800' :
          'bg-green-100 text-green-800'
        }`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
};

export default FitProgressBar;
