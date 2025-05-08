
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePromptData } from "./usePromptData";
import { PromptForm } from "./PromptForm";
import { LoadingState } from "./LoadingState";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIPromptSettingsProps {
  module: string;
  title: string;
  description: string;
}

const AIPromptSettings: React.FC<AIPromptSettingsProps> = ({
  module,
  title,
  description
}) => {
  const {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    handleSave
  } = usePromptData(module || '');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{title || 'AI Prompt Settings'}</CardTitle>
          <CardDescription>{description || 'Configure AI prompts'}</CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] text-xs">
                <p>
                  System prompts work best in English. Add language instructions in your user prompt if needed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <CardContent>
          <PromptForm
            systemPrompt={systemPrompt || ''}
            userPrompt={userPrompt || ''}
            setSystemPrompt={setSystemPrompt}
            setUserPrompt={setUserPrompt}
            handleSave={() => handleSave('english')}
            isSaving={isSaving}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default AIPromptSettings;
