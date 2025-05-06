
import React from "react";
import { ContentPillar } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedContentPillarsProps {
  savedPillars: ContentPillar[];
  onDelete: (id: string) => void;
}

const SavedContentPillars = ({
  savedPillars,
  onDelete
}: SavedContentPillarsProps) => {
  if (savedPillars.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-lg font-medium">No saved content pillars</h3>
            <p className="text-muted-foreground">
              Your saved content pillars will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Your Saved Content Pillars</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {savedPillars.map((pillar) => (
          <Card key={pillar.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{pillar.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {pillar.description}
                  </CardDescription>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(pillar.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Key Subtopics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pillar.subtopics.slice(0, 3).map((subtopic, index) => (
                      <Badge key={index} variant="secondary">{subtopic.title}</Badge>
                    ))}
                    {pillar.subtopics.length > 3 && (
                      <Badge variant="outline">+{pillar.subtopics.length - 3} more</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Content Ideas:</h4>
                  <p className="text-sm text-muted-foreground">
                    {pillar.subtopics.reduce((count, subtopic) => count + subtopic.contentIdeas.length, 0)} content ideas across {pillar.formats.length} formats
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 justify-between">
              <div className="text-xs text-muted-foreground">
                Keywords: {pillar.keywords.slice(0, 3).join(", ")}
                {pillar.keywords.length > 3 && "..."}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete this content pillar and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(pillar.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedContentPillars;
