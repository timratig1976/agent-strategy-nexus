
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UspCanvas } from "../types";
import { PieChart } from "@/components/ui/chart";
import { CircleAlert, CircleCheck } from "lucide-react";

interface ValueMapSummaryProps {
  canvas: UspCanvas;
}

const ValueMapSummary: React.FC<ValueMapSummaryProps> = ({ canvas }) => {
  // Data for the pie chart
  const chartData = {
    labels: ['Products & Services', 'Pain Relievers', 'Gain Creators'],
    datasets: [
      {
        label: 'Count',
        data: [
          canvas.productServices.length,
          canvas.painRelievers.length, 
          canvas.gainCreators.length
        ],
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981'],
        borderColor: ['#2563eb', '#dc2626', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  // Count total items and connections
  const totalItems = canvas.productServices.length + canvas.painRelievers.length + canvas.gainCreators.length;
  const totalConnections = 
    canvas.productServices.reduce((total, item) => total + item.relatedJobIds.length, 0) +
    canvas.painRelievers.reduce((total, item) => total + item.relatedPainIds.length, 0) +
    canvas.gainCreators.reduce((total, item) => total + item.relatedGainIds.length, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Value Map Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalItems > 0 ? (
          <div className="h-52">
            <PieChart data={chartData} />
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <CircleAlert className="mx-auto h-10 w-10 text-amber-500 mb-2" />
              <p>No value map data available</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{totalItems}</div>
            <div className="text-xs text-blue-600">Total Elements</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-700">{totalConnections}</div>
            <div className="text-xs text-purple-600">Total Connections</div>
          </div>
        </div>
        
        {totalItems > 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CircleCheck className="h-4 w-4" />
            <span>Value map contains data</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <CircleAlert className="h-4 w-4" />
            <span>Value map needs to be populated</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValueMapSummary;
