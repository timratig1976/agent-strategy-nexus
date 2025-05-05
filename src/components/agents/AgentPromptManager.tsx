
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Agent } from "@/types/marketing";

interface AgentPromptManagerProps {
  agentId: string;
}

interface AgentPrompt {
  id: string;
  agent_id: string;
  system_prompt: string;
  user_prompt: string;
  created_at: string;
  updated_at: string;
}

export const AgentPromptManager: React.FC<AgentPromptManagerProps> = ({ agentId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [agent, setAgent] = useState<Agent | null>(null);

  // Fetch agent data and prompts when component mounts
  useEffect(() => {
    const fetchAgentAndPrompts = async () => {
      if (!user || !agentId) return;

      try {
        setIsLoading(true);
        
        // Fetch agent data
        const { data: agentData, error: agentError } = await supabase
          .from("agents")
          .select("*")
          .eq("id", agentId)
          .single();

        if (agentError) {
          throw agentError;
        }

        // Map snake_case database columns to camelCase interface properties
        setAgent({
          id: agentData.id,
          name: agentData.name,
          type: agentData.type,
          description: agentData.description || "",
          isActive: agentData.is_active,
        });

        // Fetch agent prompts
        const { data: promptData, error: promptError } = await supabase
          .from("agent_prompts")
          .select("*")
          .eq("agent_id", agentId)
          .maybeSingle();

        if (promptError && promptError.code !== "PGRST116") { // Not found error is ok
          throw promptError;
        }

        if (promptData) {
          setSystemPrompt(promptData.system_prompt || "");
          setUserPrompt(promptData.user_prompt || "");
        }
      } catch (error) {
        console.error("Error fetching agent and prompts:", error);
        toast({
          title: "Error",
          description: "Failed to load agent prompts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentAndPrompts();
  }, [user, agentId, toast]);

  const handleSavePrompts = async () => {
    if (!user || !agentId) return;

    try {
      setIsLoading(true);

      const { data: existingPrompt } = await supabase
        .from("agent_prompts")
        .select("id")
        .eq("agent_id", agentId)
        .maybeSingle();

      let result;
      if (existingPrompt) {
        // Update existing prompt
        result = await supabase
          .from("agent_prompts")
          .update({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPrompt.id);
      } else {
        // Insert new prompt
        result = await supabase
          .from("agent_prompts")
          .insert({
            agent_id: agentId,
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: "Agent prompts saved successfully",
      });
    } catch (error) {
      console.error("Error saving prompts:", error);
      toast({
        title: "Error",
        description: "Failed to save agent prompts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Agent Prompts</CardTitle>
        <CardDescription>
          Customize the prompts used by this agent when generating content with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">System Prompt</h3>
          <Textarea
            placeholder="Enter the system prompt (instructions to the AI)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            This defines the AI's behavior and expertise. It's like telling the AI what role to play.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">User Prompt Template</h3>
          <Textarea
            placeholder="Enter the user prompt template"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            This is the template for what to ask the AI. Use &#123;&#123;variables&#125;&#125; that will be replaced with actual data.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSavePrompts} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Prompts"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
