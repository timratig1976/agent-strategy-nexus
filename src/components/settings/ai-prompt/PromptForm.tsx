
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface PromptFormProps {
  systemPrompt: string;
  userPrompt: string;
  setSystemPrompt: (value: string) => void;
  setUserPrompt: (value: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  language: "english" | "deutsch";
}

export const PromptForm: React.FC<PromptFormProps> = ({
  systemPrompt,
  userPrompt,
  setSystemPrompt,
  setUserPrompt,
  handleSave,
  isSaving,
  language
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          {language === 'english' ? 'System Prompt' : 'System Prompt'}
        </h3>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={6}
          placeholder={language === 'english' 
            ? "Instructions for the AI system" 
            : "Anweisungen für das KI-System"}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {language === 'english' 
            ? "This defines how the AI behaves when generating content. It sets the tone, expertise, and approach."
            : "Dies definiert, wie sich die KI bei der Generierung von Inhalten verhält. Es legt Tonfall, Expertise und Ansatz fest."}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          {language === 'english' ? 'User Prompt Template' : 'Benutzer-Prompt Vorlage'}
        </h3>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={6}
          placeholder={language === 'english' 
            ? "Template for the user prompt with variables" 
            : "Vorlage für den Benutzer-Prompt mit Variablen"}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {language === 'english' 
            ? "This is the template for what will be sent to the AI. Use {{variables}} for dynamic content."
            : "Dies ist die Vorlage für das, was an die KI gesendet wird. Verwenden Sie {{Variablen}} für dynamische Inhalte."}
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{language === 'english' ? 'Saving...' : 'Speichern...'}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>
                {language === 'english' 
                  ? 'Save English Prompt' 
                  : 'Deutschen Prompt speichern'}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
