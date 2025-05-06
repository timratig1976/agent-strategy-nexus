
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIResultEditorProps<T> {
  title: string;
  description: string;
  originalContent: T;
  contentField: keyof T;
  onSave: (updatedContent: T) => void;
  isLoading?: boolean;
}

export const AIResultEditor = <T extends Record<string, any>>({
  title,
  description,
  originalContent,
  contentField,
  onSave,
  isLoading = false
}: AIResultEditorProps<T>) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<string>(
    typeof originalContent[contentField] === 'string' 
      ? originalContent[contentField] as string
      : JSON.stringify(originalContent[contentField], null, 2)
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepare updated content
      const updatedContent = {
        ...originalContent,
        [contentField]: typeof originalContent[contentField] === 'string'
          ? editedContent
          : JSON.parse(editedContent)
      };
      
      // Call the save callback
      await onSave(updatedContent);
      
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditedContent(
      typeof originalContent[contentField] === 'string'
        ? originalContent[contentField] as string
        : JSON.stringify(originalContent[contentField], null, 2)
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4 pt-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="compare" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Original Content</h3>
                <div className="border rounded-md p-3 bg-muted/20 min-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-sm">
                  {typeof originalContent[contentField] === 'string'
                    ? originalContent[contentField] as string
                    : JSON.stringify(originalContent[contentField], null, 2)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Edited Content</h3>
                <div className="border rounded-md p-3 bg-muted/20 min-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-sm">
                  {editedContent}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || editedContent === (
            typeof originalContent[contentField] === 'string'
              ? originalContent[contentField]
              : JSON.stringify(originalContent[contentField], null, 2)
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
