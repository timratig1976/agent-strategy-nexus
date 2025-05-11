
import React from "react";
import { Strategy } from "@/types/marketing";
import { Card } from "@/components/ui/card";

interface DashboardSummaryProps {
  strategies: Strategy[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ strategies }) => {
  // Calculate summary metrics
  const totalStrategies = strategies.length;
  const completedStrategies = strategies.filter(s => s.state === 'completed').length;
  const inProgressStrategies = totalStrategies - completedStrategies;
  const completionRate = totalStrategies > 0 
    ? Math.round((completedStrategies / totalStrategies) * 100)
    : 0;

  const metrics = [
    {
      label: "Total Strategies",
      value: totalStrategies,
      icon: "📊",
      color: "bg-blue-50 text-blue-700"
    },
    {
      label: "Completed",
      value: completedStrategies,
      icon: "✅",
      color: "bg-green-50 text-green-700"
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: "📈",
      color: "bg-purple-50 text-purple-700"
    },
    {
      label: "In Progress",
      value: inProgressStrategies,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className={`p-4 rounded-md ${metric.color} flex items-center`}
        >
          <span className="text-2xl mr-3">{metric.icon}</span>
          <div>
            <p className="text-sm font-medium">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
