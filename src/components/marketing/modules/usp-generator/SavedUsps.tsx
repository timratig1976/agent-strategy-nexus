
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Award, Target } from "lucide-react";
import { UspItem } from "./types";

interface SavedUspsProps {
  savedUsps: UspItem[];
  onDelete: (id: string) => void;
}

const SavedUsps = ({ savedUsps, onDelete }: SavedUspsProps) => {
  if (savedUsps.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-2">You haven't saved any USPs yet.</p>
        <p className="text-sm text-muted-foreground">
          Generate and save USPs to see them here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Saved USPs</h3>
        <p className="text-sm text-muted-foreground">
          {savedUsps.length} saved item{savedUsps.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {savedUsps.map((usp) => (
          <Card key={usp.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">{usp.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Saved on {format(new Date(usp.createdAt), "MMM d, yyyy")}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p>{usp.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium">
                    <Target className="mr-2 h-4 w-4 text-primary" />
                    Target Audience
                  </div>
                  <p className="text-sm">{usp.audience}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium">
                    <Award className="mr-2 h-4 w-4 text-primary" />
                    Top Differentiator
                  </div>
                  <p className="text-sm">{usp.differentiators[0]}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Application Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {usp.applicationAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(usp.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedUsps;
