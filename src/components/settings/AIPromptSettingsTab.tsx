
import React from "react";
import { OutputLanguage } from "@/services/ai/types";
import { Badge } from "@/components/ui/badge";
import { ModulePromptSettings } from "./ai-prompt/ModulePromptSettings";
import { moduleLabels } from "./ai-prompt/config";

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
  
  // Get all module keys from our configuration
  const moduleKeys = Object.keys(moduleLabels || {});

  if (!moduleKeys.length) {
    console.warn("No modules found in configuration");
    return (
      <div className="p-4 text-center">
        No modules configured for AI prompt settings
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {safeLanguage === 'english' ? 'AI Prompt Settings' : 'KI-Prompt Einstellungen'}
        </h2>
        <Badge variant={safeLanguage === 'english' ? 'default' : 'secondary'}>
          {safeLanguage === 'english' ? 'English Mode' : 'Deutscher Modus'}
        </Badge>
      </div>
      
      {moduleKeys.map((moduleKey) => (
        <ModulePromptSettings
          key={moduleKey}
          module={moduleKey}
          language={safeLanguage}
        />
      ))}
    </div>
  );
};

export default AIPromptSettingsTab;
