
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { OutputLanguage } from "@/services/ai/types";
import { usePromptData } from "./usePromptData";
import { PromptForm } from "./PromptForm";
import { LoadingState } from "./LoadingState";
import { InfoCircledIcon } from "@radix-ui/react-icons";
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
  // Default to 'english' to prevent undefined
  const [outputLanguage, setOutputLanguage] = React.useState<OutputLanguage>('english');
  
  const {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    handleSave
  } = usePromptData(module || '');
  
  const handleLanguageChange = (newLanguage: OutputLanguage) => {
    // Only update if it's a valid language
    if (newLanguage === 'english' || newLanguage === 'deutsch') {
      setOutputLanguage(newLanguage);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{title || 'AI Prompt Settings'}</CardTitle>
          <CardDescription>{description || 'Configure AI prompts'}</CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm font-medium text-secondary-foreground flex items-center gap-1">
            {outputLanguage === 'english' 
              ? 'Output Language: English' 
              : 'Ausgabesprache: Deutsch'}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-xs">
                  <p>
                    {outputLanguage === 'english' 
                      ? "This controls the language used in the AI's response, not the prompt itself. Add language instructions in your user prompt if needed."
                      : "Dies steuert die Sprache in der Antwort der KI, nicht des Prompts selbst. Fügen Sie Sprachanweisungen in Ihrem Benutzer-Prompt hinzu, wenn nötig."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <LanguageSelector value={outputLanguage} onChange={handleLanguageChange} />
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
            handleSave={() => handleSave(outputLanguage)}
            isSaving={isSaving}
            outputLanguage={outputLanguage}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default AIPromptSettings;
