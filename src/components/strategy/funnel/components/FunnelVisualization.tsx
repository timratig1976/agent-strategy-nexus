
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronDown } from "lucide-react";
import { FunnelData } from "../types";
import { AreaChart, LineChart } from "@/components/ui/recharts";

interface FunnelVisualizationProps {
  funnelData: FunnelData;
  isLoading: boolean;
}

const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  funnelData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading funnel visualization...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!funnelData || !funnelData.stages || funnelData.stages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              No funnel data available. Please configure your funnel stages first.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate funnel stage widths and conversion metrics
  const stages = funnelData.stages;
  const totalStages = stages.length;
  
  // Prepare data for conversion chart
  const chartData = {
    labels: stages.map(stage => stage.name),
    datasets: [
      {
        label: "Conversion",
        data: generateConversionData(stages.length),
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: "rgb(79, 70, 229)",
        borderWidth: 2
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Funnel Visualization */}
          <div className="space-y-1">
            {stages.map((stage, index) => {
              const widthPercentage = 100 - (index * (100 / (totalStages * 2)));
              const conversionRate = index < totalStages - 1 ? 
                stages.length > 1 ? (100 - ((index + 1) * (30 / totalStages))).toFixed(1) : 100 : null;
              
              return (
                <div key={stage.id} className="relative">
                  <div
                    className="mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-md p-4 text-white text-center"
                    style={{ 
                      width: `${widthPercentage}%`,
                      minHeight: '80px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <h3 className="font-medium">{stage.name}</h3>
                    <div className="flex justify-center items-center gap-2">
                      <span className="text-xs opacity-80">
                        {stage.touchpoints?.length || 0} touchpoints
                      </span>
                      {stage.keyMetrics && stage.keyMetrics.length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                          {stage.keyMetrics[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {index < stages.length - 1 && (
                    <>
                      <div 
                        className="w-0 h-0 mx-auto" 
                        style={{ 
                          borderLeft: `${widthPercentage/2}% solid transparent`,
                          borderRight: `${widthPercentage/2}% solid transparent`,
                          borderTop: '20px solid rgb(79, 70, 229)',
                        }}
                      />
                      {conversionRate && (
                        <div className="flex justify-center items-center my-1">
                          <ChevronDown className="h-4 w-4 text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-600">
                            {conversionRate}% conversion
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Conversion Chart */}
          {stages.length > 1 && (
            <div className="mt-8 pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">Projected Conversion Rates</h4>
              <div className="h-64">
                <AreaChart data={chartData} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate sample conversion data
function generateConversionData(stageCount: number): number[] {
  if (stageCount <= 0) return [];
  
  const data = [100]; // Start with 100%
  const dropFactor = 30 / stageCount;
  
  for (let i = 1; i < stageCount; i++) {
    data.push(Math.max(5, data[i-1] - dropFactor - Math.random() * dropFactor));
  }
  
  return data;
}

export default FunnelVisualization;
