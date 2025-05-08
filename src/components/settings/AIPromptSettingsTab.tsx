
import React from "react";
import { ModulePromptSettings } from "./ai-prompt/ModulePromptSettings";
import { moduleLabels } from "./ai-prompt/config";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AIPromptSettingsTab: React.FC = () => {
  // Get all module keys from our configuration and ensure it's not undefined
  const moduleKeys = moduleLabels ? Object.keys(moduleLabels) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            AI Prompt Settings
          </h2>
        </div>
        
        <Alert className="bg-muted/50">
          <div className="flex gap-2 items-start">
            <InfoIcon className="h-5 w-5 mt-0.5 text-blue-500" />
            <AlertDescription className="text-sm">
              System prompts work best in English. You can include language instructions in your user prompts if you need responses in other languages.
            </AlertDescription>
          </div>
        </Alert>
      </div>
      
      {moduleKeys.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No modules configured for AI prompt settings
        </div>
      ) : (
        moduleKeys.map((moduleKey) => (
          <ModulePromptSettings
            key={moduleKey}
            module={moduleKey}
          />
        ))
      )}
    </div>
  );
};

export default AIPromptSettingsTab;
