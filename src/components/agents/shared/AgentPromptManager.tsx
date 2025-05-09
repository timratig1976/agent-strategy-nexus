
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RotateCcw } from "lucide-react";
import { useAgentPrompt } from "@/hooks/useAgentPrompt";

interface AgentPromptManagerProps {
  module: string;
  title?: string;
  description?: string;
  onSaved?: () => void;
}

export const AgentPromptManager: React.FC<AgentPromptManagerProps> = ({ 
  module,
  title = "Manage AI Prompts",
  description = "Customize the prompts used for AI-generated content",
  onSaved
}) => {
  const {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    promptSource,
    savePrompt,
    resetToDefault
  } = useAgentPrompt(module);

  const handleSave = async () => {
    const success = await savePrompt();
    if (success && onSaved) {
      onSaved();
    }
  };

  const handleReset = () => {
    resetToDefault();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
          {promptSource && (
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-muted">
              {promptSource === 'database' ? 'Custom' : 'Default'}
            </span>
          )}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            This is the template for what to ask the AI. Use &#123;&#123;variables&#125;&#125; that will be replaced with actual data.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleReset} 
          disabled={isLoading || isSaving}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? (
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
