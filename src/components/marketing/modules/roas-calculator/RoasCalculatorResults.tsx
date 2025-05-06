
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoasResult } from "./types";
import { BarChart, LineChart } from "@/components/ui/chart";

interface RoasCalculatorResultsProps {
  results: RoasResult;
  onReset: () => void;
}

const RoasCalculatorResults = ({ results, onReset }: RoasCalculatorResultsProps) => {
  // Format data for the funnel visualization chart
  const funnelChartData = {
    labels: ['Impressions', 'Clicks', 'Leads/Orders'],
    datasets: [
      {
        label: 'Funnel Visualization',
        data: [
          results.impressions,
          results.clicks,
          results.conversions,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Format data for the ROAS breakdown chart
  const roasBreakdownData = {
    labels: ['Ad Cost', 'Revenue', 'Profit'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [
          results.adSpend,
          results.revenue,
          results.profit
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Line chart for breakeven projection
  const profitProjectionData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Cumulative Cost',
        data: Array(6).fill(0).map((_v, i) => results.adSpend * (i + 1)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Cumulative Revenue',
        data: Array(6).fill(0).map((_v, i) => {
          // Revenue grows faster over time
          const growthFactor = 1 + (i * 0.05);
          return results.revenue * (i + 1) * growthFactor;
        }),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const getRoasBadgeColor = (roas: number) => {
    if (roas >= 4) return "bg-green-100 text-green-800 border-green-300";
    if (roas >= 2) return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-1">ROAS</p>
          <Badge variant="outline" className={`text-xl p-2 ${getRoasBadgeColor(results.roas)}`}>
            {results.roas.toFixed(2)}x
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">Return on Ad Spend</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-1">CPA</p>
          <Badge variant="outline" className="text-xl p-2 bg-blue-100 text-blue-800 border-blue-300">
            ${results.cpa.toFixed(2)}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">Cost per Acquisition</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-1">Profit</p>
          <Badge 
            variant="outline" 
            className={`text-xl p-2 ${results.profit > 0 ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
          >
            ${results.profit.toFixed(2)}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">Total Profit</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Funnel Visualization</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart data={funnelChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">ROAS Breakdown</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart data={roasBreakdownData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">6-Month Breakeven Projection</h3>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <LineChart data={profitProjectionData} options={chartOptions} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" onClick={onReset}>
            Re-calculate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoasCalculatorResults;
