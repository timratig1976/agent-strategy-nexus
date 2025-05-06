
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChannelStrategyResult } from "./types";
import { BarChart } from "@/components/ui/chart";

interface ChannelStrategyResultsProps {
  results: ChannelStrategyResult;
  onReset: () => void;
}

const ChannelStrategyResults = ({ results, onReset }: ChannelStrategyResultsProps) => {
  // Format the channel allocations for the bar chart
  const chartData = {
    labels: results.channelAllocation.map(channel => channel.name),
    datasets: [
      {
        label: "Budget Allocation (%)",
        data: results.channelAllocation.map(channel => channel.percentage),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(40, 159, 64, 0.6)',
          'rgba(210, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 206, 86)',
          'rgb(255, 159, 64)',
          'rgb(255, 99, 132)',
          'rgb(199, 199, 199)',
          'rgb(83, 102, 255)',
          'rgb(40, 159, 64)',
          'rgb(210, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Budget Allocation (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Channels'
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Channel & Budget Strategy Results</CardTitle>
          <CardDescription>
            Based on your inputs, here's your recommended marketing channel mix and budget allocation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="h-80">
            <BarChart data={chartData} options={chartOptions} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
              <div className="space-y-4">
                {results.channelAllocation.map((channel, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{channel.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${channel.budgetAmount} ({channel.percentage}%)
                      </span>
                    </div>
                    <Progress value={channel.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Expected KPIs</h3>
              <div className="space-y-3">
                {results.kpiEstimates.map((kpi, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">{kpi.name}</span>
                    <span className="text-sm">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Strategy Recommendations</h3>
            <div className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-1">{rec.channel}</h4>
                  <p className="text-sm text-muted-foreground">{rec.advice}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" onClick={onReset} className="w-full">
            Create New Strategy
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChannelStrategyResults;
