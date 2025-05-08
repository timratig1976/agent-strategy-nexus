
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
  // Check if module exists in our configuration
  if (!module || !moduleLabels[module]) {
    console.warn(`No configuration found for module "${module}"`);
    return null;
  }
  
  // Ensure the language exists or default to English
  const safeLanguage: OutputLanguage = (language === "deutsch") ? "deutsch" : "english";
  
  return (
    <AIPromptSettings
      module={module}
      title={moduleLabels[module].title[safeLanguage]}
      description={moduleLabels[module].description[safeLanguage]}
    />
  );
};
