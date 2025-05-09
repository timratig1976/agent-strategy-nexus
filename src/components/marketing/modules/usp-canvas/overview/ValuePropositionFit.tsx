
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UspCanvas } from "../types";
import { BarChart } from "@/components/ui/chart";
import { Info } from "lucide-react";
import FitProgressBar from "./FitProgressBar";

interface ValuePropositionFitProps {
  canvas: UspCanvas;
}

const ValuePropositionFit: React.FC<ValuePropositionFitProps> = ({ canvas }) => {
  // Calculate fit scores between customer profile and value map
  const jobsWithConnections = canvas.customerJobs.filter(job => 
    canvas.productServices.some(service => service.relatedJobIds.includes(job.id))
  ).length;
  
  const painsWithConnections = canvas.customerPains.filter(pain => 
    canvas.painRelievers.some(reliever => reliever.relatedPainIds.includes(pain.id))
  ).length;
  
  const gainsWithConnections = canvas.customerGains.filter(gain => 
    canvas.gainCreators.some(creator => creator.relatedGainIds.includes(gain.id))
  ).length;
  
  // Calculate percentages
  const jobsConnectionPercent = canvas.customerJobs.length > 0
    ? Math.round((jobsWithConnections / canvas.customerJobs.length) * 100)
    : 0;
    
  const painsConnectionPercent = canvas.customerPains.length > 0
    ? Math.round((painsWithConnections / canvas.customerPains.length) * 100)
    : 0;
    
  const gainsConnectionPercent = canvas.customerGains.length > 0
    ? Math.round((gainsWithConnections / canvas.customerGains.length) * 100)
    : 0;
  
  // Calculate overall fit percentage
  const totalItems = canvas.customerJobs.length + canvas.customerPains.length + canvas.customerGains.length;
  const totalConnected = jobsWithConnections + painsWithConnections + gainsWithConnections;
  const overallFitPercent = totalItems > 0
    ? Math.round((totalConnected / totalItems) * 100)
    : 0;
  
  // Chart data
  const chartData = {
    labels: ['Jobs', 'Pains', 'Gains'],
    datasets: [
      {
        label: 'Addressed %',
        data: [jobsConnectionPercent, painsConnectionPercent, gainsConnectionPercent],
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(16, 185, 129, 0.7)'],
        borderColor: ['#2563eb', '#dc2626', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Value Proposition Fit
          <div className="tooltip relative inline-block">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <span className="tooltip-text absolute invisible bg-gray-800 text-white text-xs rounded p-2 w-64 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 transition-opacity group-hover:opacity-100 group-hover:visible z-50">
              Shows how well your value proposition addresses customer needs
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{overallFitPercent}%</div>
          <div className="text-xs text-muted-foreground">Overall Fit</div>
          
          <div className="mt-3">
            <FitProgressBar percentage={overallFitPercent} />
          </div>
        </div>
        
        <div className="h-52">
          <BarChart data={chartData} />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-medium">{jobsWithConnections} / {canvas.customerJobs.length}</div>
            <div className="text-muted-foreground">Jobs Addressed</div>
          </div>
          <div>
            <div className="font-medium">{painsWithConnections} / {canvas.customerPains.length}</div>
            <div className="text-muted-foreground">Pains Relieved</div>
          </div>
          <div>
            <div className="font-medium">{gainsWithConnections} / {canvas.customerGains.length}</div>
            <div className="text-muted-foreground">Gains Created</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuePropositionFit;
