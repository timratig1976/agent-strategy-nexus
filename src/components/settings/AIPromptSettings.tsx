
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";

interface AIPromptSettingsProps {
  module: string;
  title: string;
  description: string;
}

export const AIPromptSettings: React.FC<AIPromptSettingsProps> = ({
  module,
  title,
  description
}) => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPromptData();
  }, [module]);

  const fetchPromptData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("system_prompt, user_prompt")
        .eq("module", module)
        .single();

      if (error) {
        console.error("Error fetching prompt data:", error);
        toast.error("Failed to load prompt data");
      } else if (data) {
        setSystemPrompt(data.system_prompt || "");
        setUserPrompt(data.user_prompt || "");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load prompt data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!systemPrompt.trim() || !userPrompt.trim()) {
      toast.error("Both system and user prompts are required");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          updated_at: new Date().toISOString(),
        })
        .eq("module", module);

      if (error) throw error;
      toast.success("AI prompt updated successfully");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to update AI prompt");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">System Prompt</h3>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            placeholder="Instructions for the AI system"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This defines how the AI behaves when generating content. It sets the tone, expertise, and approach.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">User Prompt Template</h3>
          <Textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={6}
            placeholder="Template for the user prompt with variables"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This is the template for what will be sent to the AI. Use &#123;&#123;variables&#125;&#125; for dynamic content.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Prompt</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPromptSettings;
