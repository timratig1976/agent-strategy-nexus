
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { OutputLanguage } from "@/services/ai/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface PromptFormProps {
  systemPrompt: string;
  userPrompt: string;
  setSystemPrompt: (value: string) => void;
  setUserPrompt: (value: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  outputLanguage: OutputLanguage;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  systemPrompt,
  userPrompt,
  setSystemPrompt,
  setUserPrompt,
  handleSave,
  isSaving,
  outputLanguage
}) => {
  const languageInstructionExamples = {
    english: [
      "Write all responses in English, using a professional tone suitable for marketing experts.",
      "Use simple and clear language that would be understandable to someone without technical marketing knowledge."
    ],
    deutsch: [
      "Schreibe alle Antworten auf Deutsch. Verwende einen professionellen Tonfall, der für Marketing-Experten geeignet ist.",
      "Bitte antworte ausschließlich auf Deutsch und verwende einen klaren, direkten Kommunikationsstil."
    ]
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          System Prompt
        </h3>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={6}
          placeholder="Instructions for the AI system (always in English for best results)"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {outputLanguage === 'english' 
            ? "This defines how the AI behaves when generating content. Use English for best results, even when you want outputs in German."
            : "Dies definiert, wie sich die KI bei der Generierung von Inhalten verhält. Verwenden Sie Englisch für beste Ergebnisse, selbst wenn Sie deutsche Ausgaben wünschen."}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          {outputLanguage === 'english' ? 'User Prompt Template' : 'Benutzer-Prompt Vorlage'}
        </h3>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={6}
          placeholder={outputLanguage === 'english' 
            ? "Template for the user prompt with variables" 
            : "Vorlage für den Benutzer-Prompt mit Variablen"}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {outputLanguage === 'english' 
            ? "This is the template for what will be sent to the AI. Use {{variables}} for dynamic content."
            : "Dies ist die Vorlage für das, was an die KI gesendet wird. Verwenden Sie {{Variablen}} für dynamische Inhalte."}
        </p>
        
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="language-examples">
            <AccordionTrigger>
              <div className="flex items-center">
                <span>
                  {outputLanguage === 'english' 
                    ? 'Example language instructions' 
                    : 'Beispiele für Sprachanweisungen'}
                </span>
                <Badge variant="outline" className="ml-2">
                  {outputLanguage === 'english' ? 'Helpful' : 'Hilfreich'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 py-2">
                <p className="text-xs text-muted-foreground mb-2">
                  {outputLanguage === 'english' 
                    ? 'Include these examples at the beginning or end of your user prompt to control output language:' 
                    : 'Fügen Sie diese Beispiele am Anfang oder Ende Ihres Benutzer-Prompts ein, um die Ausgabesprache zu steuern:'}
                </p>
                {languageInstructionExamples[outputLanguage === 'deutsch' ? 'deutsch' : 'english'].map((example, index) => (
                  <div key={index} className="bg-muted p-2 rounded text-xs font-mono">
                    {example}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
              <span>{outputLanguage === 'english' ? 'Saving...' : 'Speichern...'}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>
                {outputLanguage === 'english' 
                  ? 'Save Prompt' 
                  : 'Prompt speichern'}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
