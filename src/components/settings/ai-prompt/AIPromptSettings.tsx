
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { OutputLanguage } from "@/services/ai/types";
import { usePromptData } from "./usePromptData";
import { PromptForm } from "./PromptForm";
import { LoadingState } from "./LoadingState";

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
  const [language, setLanguage] = React.useState<OutputLanguage>('english');
  
  const {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    handleSave
  } = usePromptData(module, language);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm font-medium text-secondary-foreground">
            {language === 'english' 
              ? 'Editing English Prompt' 
              : 'Bearbeite Deutschen Prompt'}
          </div>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
      </CardHeader>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <CardContent>
          <PromptForm
            systemPrompt={systemPrompt}
            userPrompt={userPrompt}
            setSystemPrompt={setSystemPrompt}
            setUserPrompt={setUserPrompt}
            handleSave={handleSave}
            isSaving={isSaving}
            language={language}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default AIPromptSettings;
