
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadMagnet } from "./types";
import { ArrowLeft, Download, List, Check, Save } from "lucide-react";

interface LeadMagnetResultsProps {
  leadMagnets: LeadMagnet[];
  onSave: (magnet: LeadMagnet) => void;
  onBack: () => void;
}

const LeadMagnetResults = ({ leadMagnets, onSave, onBack }: LeadMagnetResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
        </Button>
        <p className="text-sm text-muted-foreground">
          {leadMagnets.length} lead magnet{leadMagnets.length !== 1 ? "s" : ""} generated
        </p>
      </div>

      <div className="space-y-6">
        {leadMagnets.map((magnet) => (
          <Card key={magnet.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10">
                      {magnet.format}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/10">
                      {magnet.funnelStage} stage
                    </Badge>
                  </div>
                  <CardTitle>{magnet.title}</CardTitle>
                  <CardDescription className="mt-2">{magnet.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold flex items-center">
                  <List className="mr-2 h-4 w-4" /> Content Outline
                </h4>
                <ul className="mt-2 text-sm space-y-1">
                  {magnet.contentOutline.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Implementation Steps</h4>
                  <ul className="mt-2 text-sm space-y-1">
                    {magnet.implementationSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 font-semibold">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold">Target Audience</h4>
                    <p className="text-sm mt-1">{magnet.targetAudience}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold">Est. Conversion Rate</h4>
                    <p className="text-sm mt-1">{magnet.estimatedConversionRate}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold">Recommended CTA</h4>
                    <p className="text-sm mt-1 font-medium text-primary">{magnet.callToAction}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export as PDF
              </Button>
              <Button 
                size="sm"
                onClick={() => onSave(magnet)}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" /> Save Lead Magnet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadMagnetResults;
