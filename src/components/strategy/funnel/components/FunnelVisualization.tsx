
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FunnelData } from "../types";

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
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading funnel visualization...</span>
      </div>
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

  // Calculate funnel stage widths
  const stages = funnelData.stages;
  const totalStages = stages.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stages.map((stage, index) => {
            const widthPercentage = 100 - (index * (100 / (totalStages * 2)));
            
            return (
              <div key={stage.id} className="relative">
                <div
                  className="mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-md p-4 text-white text-center"
                  style={{ 
                    width: `${widthPercentage}%`,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <h3 className="font-medium">{stage.name}</h3>
                  <p className="text-xs opacity-80">{stage.touchpoints.length} touchpoints</p>
                </div>
                {index < stages.length - 1 && (
                  <div 
                    className="w-0 h-0 mx-auto" 
                    style={{ 
                      borderLeft: `${widthPercentage/2}% solid transparent`,
                      borderRight: `${widthPercentage/2}% solid transparent`,
                      borderTop: '20px solid rgb(79, 70, 229)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelVisualization;
