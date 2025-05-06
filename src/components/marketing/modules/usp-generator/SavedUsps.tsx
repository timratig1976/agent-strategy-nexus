
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UspItem } from "./types";
import { Calendar, Download, MessageSquare, Target, Trash2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface SavedUspsProps {
  savedUsps: UspItem[];
  onDelete: (id: string) => void;
}

const SavedUsps: React.FC<SavedUspsProps> = ({ savedUsps, onDelete }) => {
  if (savedUsps.length === 0) {
    return (
      <Card className="bg-muted/40">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground">
            You haven't saved any USPs yet. Generate some USPs and save them to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Saved USPs</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {savedUsps.map((usp) => (
          <Card key={usp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{usp.title}</CardTitle>
                  <p className="text-muted-foreground">
                    For: <span className="font-medium">{usp.audience}</span>
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(usp.createdAt), { addSuffix: true })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{usp.description}</p>

              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Supporting Points
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {usp.supportingPoints.map((point, index) => (
                    <li key={index} className="text-sm">{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Key Differentiators
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {usp.differentiators.map((diff, index) => (
                    <li key={index} className="text-sm">{diff}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Target className="h-4 w-4 mr-2" />
                  Where to Apply
                </h4>
                <div className="flex flex-wrap gap-2">
                  {usp.applicationAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="bg-muted/50">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(usp.id)}
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

export default SavedUsps;
