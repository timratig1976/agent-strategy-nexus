
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadMagnet } from "./types";
import { Calendar, Download, MessageSquare, Target, Trash2, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface SavedLeadMagnetsProps {
  savedMagnets: LeadMagnet[];
  onDelete: (id: string) => void;
}

const SavedLeadMagnets: React.FC<SavedLeadMagnetsProps> = ({ savedMagnets, onDelete }) => {
  const handleCopyOutline = (magnet: LeadMagnet) => {
    const content = `
# ${magnet.title}

## Description
${magnet.description}

## Target Audience
${magnet.targetAudience}

## Content Outline
${magnet.contentOutline.map((item, i) => `${i + 1}. ${item}`).join('\n')}

## Implementation Steps
${magnet.implementationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Call to Action
${magnet.callToAction}
    `;
    
    navigator.clipboard.writeText(content);
    toast.success("Content outline copied to clipboard");
  };

  if (savedMagnets.length === 0) {
    return (
      <Card className="bg-muted/40">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground">
            You haven't saved any lead magnets yet. Generate some ideas and save them to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Saved Lead Magnets</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {savedMagnets.map((magnet) => (
          <Card key={magnet.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{magnet.title}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="mr-2 bg-primary/10">
                      {magnet.format.charAt(0).toUpperCase() + magnet.format.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(magnet.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-muted">
                  {magnet.funnelStage.charAt(0).toUpperCase() + magnet.funnelStage.slice(1)} Stage
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{magnet.description}</p>

              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Target className="h-4 w-4 mr-2" />
                  Target Audience
                </h4>
                <p className="text-sm text-muted-foreground">{magnet.targetAudience}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Content Outline
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {magnet.contentOutline.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    <span className="font-medium">Est. Conversion:</span>{" "}
                    <span className="text-muted-foreground">{magnet.estimatedConversionRate}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">CTA:</span>{" "}
                    <span className="text-muted-foreground">{magnet.callToAction}</span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleCopyOutline(magnet)}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy Outline
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(magnet.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedLeadMagnets;
