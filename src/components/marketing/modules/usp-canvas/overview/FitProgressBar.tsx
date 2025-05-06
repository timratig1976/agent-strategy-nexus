
import React from "react";

interface FitProgressBarProps {
  label: string;
  percentage: number;
}

const FitProgressBar = ({ label, percentage }: FitProgressBarProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            percentage < 30 ? 'bg-red-500' : 
            percentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
          }`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {percentage < 30 ? 'Poor fit - more connections needed' : 
         percentage < 70 ? 'Moderate fit - consider adding more connections' : 
         `Good fit between ${label.toLowerCase().split(' ')[0]}s and customer ${label.toLowerCase().split('-')[1] || 'needs'}`}
      </div>
    </div>
  );
};

export default FitProgressBar;
