
import React from "react";

interface FitProgressBarProps {
  percentage: number;
}

const FitProgressBar: React.FC<FitProgressBarProps> = ({ percentage }) => {
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Determine label based on percentage
  const getLabel = () => {
    if (percentage >= 80) return "Excellent fit";
    if (percentage >= 60) return "Good fit";
    if (percentage >= 40) return "Average fit";
    if (percentage >= 20) return "Poor fit";
    return "Very poor fit";
  };

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-muted-foreground">{getLabel()}</div>
    </div>
  );
};

export default FitProgressBar;
