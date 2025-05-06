
import React from "react";
import { CampaignIdea } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trash2, Calendar } from "lucide-react";

interface SavedCampaignIdeasProps {
  savedIdeas: CampaignIdea[];
  onDelete: (id: string) => void;
}

const SavedCampaignIdeas = ({
  savedIdeas,
  onDelete
}: SavedCampaignIdeasProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Saved Campaign Ideas</h3>
      
      {savedIdeas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No saved campaign ideas yet.</p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Generate and save ideas from the generator tab.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedIdeas.map((idea) => (
            <Card key={idea.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(idea.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{idea.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {idea.channels.slice(0, 3).map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">{channel}</Badge>
                  ))}
                  {idea.channels.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{idea.channels.length - 3}</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => onDelete(idea.id)}
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

export default SavedCampaignIdeas;
