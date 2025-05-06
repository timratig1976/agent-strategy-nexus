
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Save, ArrowRight } from "lucide-react";
import { LeadMagnet } from "./types";
import { Badge } from "@/components/ui/badge";

interface LeadMagnetResultsProps {
  leadMagnets: LeadMagnet[];
  onSave: (magnet: LeadMagnet) => void;
  isGenerating: boolean;
}

const LeadMagnetResults = ({ leadMagnets, onSave, isGenerating }: LeadMagnetResultsProps) => {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-lg text-center">Generating lead magnet ideas tailored to your needs...</p>
        <p className="text-muted-foreground text-center mt-2">This may take a few moments.</p>
      </div>
    );
  }

  if (leadMagnets.length === 0) {
    return (
      <Card className="bg-muted/40">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground">
            No lead magnets generated yet. Fill in the form and click "Generate Lead Magnet Ideas".
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Generated Lead Magnet Ideas</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {leadMagnets.map((magnet) => (
          <Card key={magnet.id} className="overflow-hidden border-2 border-muted">
            <CardHeader className="bg-muted/40">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{magnet.title}</CardTitle>
                <Badge variant="outline" className="bg-primary/10">
                  {magnet.format.charAt(0).toUpperCase() + magnet.format.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Funnel Stage: <span className="font-medium">{magnet.funnelStage.charAt(0).toUpperCase() + magnet.funnelStage.slice(1)}</span>
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p>{magnet.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Target Audience</p>
                <p className="text-muted-foreground">{magnet.targetAudience}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Content Outline</p>
                <ul className="list-disc pl-5 space-y-1">
                  {magnet.contentOutline.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Implementation Steps</p>
                <ol className="list-decimal pl-5 space-y-1">
                  {magnet.implementationSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-sm font-medium">Estimated Conversion Rate</p>
                  <p className="text-muted-foreground">{magnet.estimatedConversionRate}</p>
                </div>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  {magnet.callToAction} <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t">
              <Button 
                className="w-full" 
                onClick={() => onSave(magnet)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Lead Magnet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadMagnetResults;
