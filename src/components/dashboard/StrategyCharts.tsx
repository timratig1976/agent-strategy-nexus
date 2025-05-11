
import React from "react";
import { Strategy, StrategyState } from "@/types/marketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, LineChart } from "@/components/ui/chart";
import { getStateLabel } from "@/utils/strategyUtils";

interface StrategyChartsProps {
  strategies: Strategy[];
}

const StrategyCharts: React.FC<StrategyChartsProps> = ({ strategies }) => {
  // Process data for the distribution chart
  const statusDistribution = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};

    // Count strategies by state
    strategies.forEach(strategy => {
      const state = strategy.state as StrategyState;
      const label = getStateLabel(state);
      
      if (statusCounts[label]) {
        statusCounts[label]++;
      } else {
        statusCounts[label] = 1;
      }
    });

    // Prepare data for PieChart
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = [
      '#3b82f6', // blue-500
      '#8b5cf6', // violet-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#6366f1', // indigo-500
      '#ec4899', // pink-500
      '#14b8a6', // teal-500
    ];

    return {
      labels,
      datasets: [{
        label: 'Strategies by Status',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: ['#ffffff'], // Make sure borderColor is an array of strings
        borderWidth: 1
      }]
    };
  }, [strategies]);

  // Process data for the completion trend chart
  // This is a simplified example - in a real app, you might want to use actual dates
  const completionTrend = React.useMemo(() => {
    // For demo, let's create a trend with the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Random data for demonstration - in a real app, you'd calculate this from real data
    const completedData = [3, 5, 7, 10, 12, 15].map(value => 
      Math.floor(Math.random() * 5) + value
    );
    
    const inProgressData = [8, 10, 12, 15, 17, 18].map(value => 
      Math.floor(Math.random() * 5) + value
    );

    return {
      labels: months,
      datasets: [
        {
          label: 'Completed',
          data: completedData,
          borderColor: '#10b981', // Changed back to a single string for LineChart
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        },
        {
          label: 'In Progress',
          data: inProgressData,
          borderColor: '#f59e0b', // Changed back to a single string for LineChart
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true
        }
      ]
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Strategy Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <PieChart data={statusDistribution} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Strategy Progress Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <LineChart data={completionTrend} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyCharts;
