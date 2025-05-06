
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadMagnet } from "./types";
import { Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface SavedLeadMagnetsProps {
  savedMagnets: LeadMagnet[];
  onDelete: (id: string) => void;
}

const SavedLeadMagnets = ({ savedMagnets, onDelete }: SavedLeadMagnetsProps) => {
  if (savedMagnets.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-2">You haven't saved any lead magnets yet.</p>
        <p className="text-sm text-muted-foreground">
          Generate and save lead magnets to see them here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Saved Lead Magnets</h3>
        <p className="text-sm text-muted-foreground">
          {savedMagnets.length} saved item{savedMagnets.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedMagnets.map((magnet) => (
          <Card key={magnet.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10">
                  {magnet.format}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10">
                  {magnet.funnelStage} stage
                </Badge>
              </div>
              <CardTitle className="text-lg">{magnet.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Saved on {format(new Date(magnet.createdAt), "MMM d, yyyy")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{magnet.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Target Audience</p>
                  <p className="text-muted-foreground">{magnet.targetAudience}</p>
                </div>
                <div>
                  <p className="font-semibold">Est. Conversion</p>
                  <p className="text-muted-foreground">{magnet.estimatedConversionRate}</p>
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
                onClick={() => onDelete(magnet.id)}
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

export default SavedLeadMagnets;
