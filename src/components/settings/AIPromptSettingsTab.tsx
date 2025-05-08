
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
  // Get all module keys from our configuration
  const moduleKeys = Object.keys(moduleLabels);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {language === 'english' ? 'AI Prompt Settings' : 'KI-Prompt Einstellungen'}
        </h2>
        <Badge variant={language === 'english' ? 'default' : 'secondary'}>
          {language === 'english' ? 'English Mode' : 'Deutscher Modus'}
        </Badge>
      </div>
      
      {moduleKeys.map((moduleKey) => (
        <ModulePromptSettings
          key={moduleKey}
          module={moduleKey}
          language={language}
        />
      ))}
    </div>
  );
};

export default AIPromptSettingsTab;
