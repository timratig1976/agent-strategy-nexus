
import React from "react";
import { UspItem } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, Target, List, Award, MessageSquare } from "lucide-react";

interface UspGeneratorResultsProps {
  usps: UspItem[];
  onSave: (usp: UspItem) => void;
  onBack: () => void;
}

const UspGeneratorResults = ({ 
  usps, 
  onSave, 
  onBack 
}: UspGeneratorResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Generator
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {usps.length} USPs generated
        </p>
      </div>

      {usps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {usps.map((usp) => (
            <Card key={usp.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">{usp.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{usp.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Target className="mr-2 h-4 w-4 text-primary" />
                      Target Audience
                    </div>
                    <p className="text-sm">{usp.audience}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <List className="mr-2 h-4 w-4 text-primary" />
                      Supporting Points
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                      {usp.supportingPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Award className="mr-2 h-4 w-4 text-primary" />
                      Key Differentiators
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                      {usp.differentiators.map((diff, index) => (
                        <li key={index}>{diff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm font-medium flex items-center mb-2">
                    <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                    Where to Use:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usp.applicationAreas.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button 
                  onClick={() => onSave(usp)}
                  className="w-full"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save This USP
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No USPs have been generated yet.</p>
        </Card>
      )}
    </div>
  );
};

export default UspGeneratorResults;
