
import React from "react";
import { format } from "date-fns";
import { AdCreative } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";

interface SavedAdCreativesProps {
  savedCreatives: AdCreative[];
  onDelete: (id: string) => void;
}

const SavedAdCreatives = ({
  savedCreatives,
  onDelete
}: SavedAdCreativesProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Saved Ad Creatives</h3>
      
      {savedCreatives.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No saved ad creatives yet.</p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Generate and save creatives from the generator tab.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedCreatives.map((creative) => (
            <Card key={creative.id} className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-1">{creative.platform}</Badge>
                    <CardTitle className="text-lg line-clamp-1">{creative.headline}</CardTitle>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(creative.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{creative.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">CTA:</span>
                  <Badge variant="secondary" className="text-xs">{creative.callToAction}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">Type:</span>
                  <span className="text-xs">{creative.adType}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => creative.id && onDelete(creative.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAdCreatives;
