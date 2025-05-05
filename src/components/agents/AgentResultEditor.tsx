import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { AgentResult } from "@/types/marketing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentResultEditorProps {
  agentId: string;
  resultId?: string;
  onSave?: (updatedResult: AgentResult) => void;
}

export const AgentResultEditor: React.FC<AgentResultEditorProps> = ({ 
  agentId, 
  resultId,
  onSave 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        
        // First try to get the specific result if resultId is provided
        let query = supabase
          .from("agent_results")
          .select("*");
          
        if (resultId) {
          query = query.eq("id", resultId);
        } else {
          // Otherwise get the latest result for the agent
          query = query
            .eq("agent_id", agentId)
            .order("created_at", { ascending: false })
            .limit(1);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          // Map snake_case database columns to camelCase interface properties
          const metadataAsRecord = typeof data.metadata === 'object' && data.metadata !== null 
            ? data.metadata as Record<string, any> 
            : {};
            
          const mappedResult: AgentResult = {
            id: data.id,
            agentId: data.agent_id,
            strategyId: data.strategy_id || "",
            content: data.content,
            createdAt: data.created_at,
            metadata: metadataAsRecord,
          };
          
          setResult(mappedResult);
          setOriginalContent(data.content);
          setEditedContent(data.content);
        }
      } catch (error) {
        console.error("Error fetching agent result:", error);
        toast({
          title: "Error",
          description: "Failed to load agent result",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      fetchResult();
    }
  }, [agentId, resultId, toast]);

  const handleSave = async () => {
    if (!result) return;

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("agent_results")
        .update({
          content: editedContent,
          metadata: { 
            ...result.metadata,
            manually_edited: true,
            edited_at: new Date().toISOString()
          }
        })
        .eq("id", result.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the local state
      const updatedResult: AgentResult = {
        id: data.id,
        agentId: data.agent_id,
        strategyId: data.strategy_id || "",
        content: data.content,
        createdAt: data.created_at,
        metadata: typeof data.metadata === 'object' && data.metadata !== null 
          ? data.metadata as Record<string, any> 
          : {},
      };
      
      setResult(updatedResult);
      setOriginalContent(editedContent);

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      if (onSave) {
        onSave(updatedResult);
      }
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
    setEditedContent(originalContent);
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

  if (!result) {
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">No result found to edit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit AI-Generated Content</CardTitle>
        <CardDescription>
          Modify and enhance the content generated by the AI
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
                  {originalContent}
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
        <Button onClick={handleSave} disabled={isSaving || editedContent === originalContent}>
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
