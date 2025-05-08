
import React from "react";
import { AIPromptSettings } from "@/components/settings";
import { moduleLabels } from "./config";

interface ModulePromptSettingsProps {
  module: string;
}

export const ModulePromptSettings: React.FC<ModulePromptSettingsProps> = ({ 
  module 
}) => {
  // Check if module exists in our configuration
  if (!module || !moduleLabels || !moduleLabels[module]) {
    console.warn(`No configuration found for module "${module}"`);
    return null;
  }
  
  return (
    <AIPromptSettings
      module={module}
      title={moduleLabels[module]?.title?.english || module}
      description={moduleLabels[module]?.description?.english || ''}
    />
  );
};
