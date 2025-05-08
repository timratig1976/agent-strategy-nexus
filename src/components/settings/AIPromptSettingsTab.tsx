
import React, { useState } from "react";
import { OutputLanguage } from "@/services/ai/types";
import { Badge } from "@/components/ui/badge";
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
import { LanguageSelector } from "@/components/ui/language-selector";

interface AIPromptSettingsTabProps {
  language: OutputLanguage;
  onLanguageChange: (language: OutputLanguage) => void;
}

export const AIPromptSettingsTab: React.FC<AIPromptSettingsTabProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  // Ensure the language is valid or default to English
  const safeLanguage: OutputLanguage = (language === "deutsch") ? "deutsch" : "english";
  
  // Get all module keys from our configuration and ensure it's not undefined
  const moduleKeys = moduleLabels ? Object.keys(moduleLabels) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {safeLanguage === 'english' ? 'AI Prompt Settings' : 'KI-Prompt Einstellungen'}
          </h2>
          <div>
            <LanguageSelector value={safeLanguage} onChange={onLanguageChange} />
          </div>
        </div>
        
        <Alert className="bg-muted/50">
          <div className="flex gap-2 items-start">
            <InfoIcon className="h-5 w-5 mt-0.5 text-blue-500" />
            <AlertDescription className="text-sm">
              {safeLanguage === 'english' 
                ? "The language selection controls the output language for AI responses. System prompts work best in English, and you can include language instructions in your user prompts." 
                : "Die Sprachauswahl steuert die Ausgabesprache für KI-Antworten. System-Prompts funktionieren am besten auf Englisch. Sie können Sprachanweisungen in Ihren Benutzer-Prompts einfügen."}
            </AlertDescription>
          </div>
        </Alert>
      </div>
      
      {moduleKeys.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          {safeLanguage === 'english' 
            ? 'No modules configured for AI prompt settings' 
            : 'Keine Module für KI-Prompt-Einstellungen konfiguriert'}
        </div>
      ) : (
        moduleKeys.map((moduleKey) => (
          <ModulePromptSettings
            key={moduleKey}
            module={moduleKey}
            language={safeLanguage}
          />
        ))
      )}
    </div>
  );
};

export default AIPromptSettingsTab;
