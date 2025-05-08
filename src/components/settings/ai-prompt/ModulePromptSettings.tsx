
import React from "react";
import { AIPromptSettings } from "@/components/settings";
import { OutputLanguage } from "@/services/ai/types";
import { moduleLabels } from "./config";

interface ModulePromptSettingsProps {
  module: string;
  language: OutputLanguage;
}

export const ModulePromptSettings: React.FC<ModulePromptSettingsProps> = ({ 
  module, 
  language 
}) => {
  if (!moduleLabels[module]) {
    console.warn(`No configuration found for module "${module}"`);
    return null;
  }
  
  return (
    <AIPromptSettings
      module={module}
      title={moduleLabels[module].title[language]}
      description={moduleLabels[module].description[language]}
    />
  );
};
