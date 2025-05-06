
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { PromptFormProps } from "./types";

export const PromptForm: React.FC<PromptFormProps> = ({
  systemPrompt,
  userPrompt,
  isLoading,
  onChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">System Prompt</label>
        <Textarea
          placeholder="Enter system prompt (instructions for the AI)"
          value={systemPrompt}
          onChange={(e) => onChange('systemPrompt', e.target.value)}
          className="min-h-[150px] font-mono text-sm"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          The system prompt defines the AI's behavior and expertise.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">User Prompt Template</label>
        <Textarea
          placeholder="Enter the user prompt template"
          value={userPrompt}
          onChange={(e) => onChange('userPrompt', e.target.value)}
          className="min-h-[200px] font-mono text-sm"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Use variables like &#123;&#123;keyword&#125;&#125; that will be replaced with user input.
        </p>
      </div>
    </>
  );
};

export default PromptForm;
