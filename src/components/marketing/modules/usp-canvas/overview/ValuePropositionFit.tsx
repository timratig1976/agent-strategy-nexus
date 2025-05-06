
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "../types";
import FitProgressBar from "./FitProgressBar";

interface ValuePropositionFitProps {
  canvas: UspCanvas;
}

const ValuePropositionFit = ({ canvas }: ValuePropositionFitProps) => {
  // Calculate connection percentages
  const calculateConnectionPercentage = (
    sourceItems: Array<{ id: string }>,
    targetItems: Array<{ relatedJobIds?: string[], relatedPainIds?: string[], relatedGainIds?: string[] }>,
    relationProperty: 'relatedJobIds' | 'relatedPainIds' | 'relatedGainIds'
  ) => {
    if (sourceItems.length === 0) return 0;
    
    const connectedSourceIds = new Set<string>();
    
    targetItems.forEach(target => {
      const relatedIds = target[relationProperty] || [];
      relatedIds.forEach(id => connectedSourceIds.add(id));
    });
    
    return Math.round((connectedSourceIds.size / sourceItems.length) * 100);
  };

  const jobConnectionPercentage = calculateConnectionPercentage(
    canvas.customerJobs, 
    canvas.productServices, 
    'relatedJobIds'
  );

  const painConnectionPercentage = calculateConnectionPercentage(
    canvas.customerPains, 
    canvas.painRelievers, 
    'relatedPainIds'
  );

  const gainConnectionPercentage = calculateConnectionPercentage(
    canvas.customerGains, 
    canvas.gainCreators, 
    'relatedGainIds'
  );

  const averageFitPercentage = (jobConnectionPercentage + painConnectionPercentage + gainConnectionPercentage) / 3;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Value Proposition Fit</h3>
        <div className="space-y-4">
          <FitProgressBar label="Product-Job Fit" percentage={jobConnectionPercentage} />
          <FitProgressBar label="Pain-Reliever Fit" percentage={painConnectionPercentage} />
          <FitProgressBar label="Gain-Creator Fit" percentage={gainConnectionPercentage} />
          
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p className="font-medium">Value Proposition Fit Assessment</p>
            <p className="mt-1">
              {averageFitPercentage < 40 ? 
                'Your value proposition needs significant improvement. Focus on better connecting your offerings to customer needs.' : 
                averageFitPercentage < 70 ?
                'Your value proposition has moderate fit. Continue refining connections between what you offer and what customers need.' :
                'Your value proposition shows good fit! You\'ve established strong connections between your offerings and customer needs.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuePropositionFit;
