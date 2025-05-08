
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
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
}

export const PromptForm: React.FC<PromptFormProps> = ({
  systemPrompt,
  userPrompt,
  setSystemPrompt,
  setUserPrompt,
  handleSave,
  isSaving,
}) => {
  const languageInstructionExamples = [
    "Write all responses in English, using a professional tone suitable for marketing experts.",
    "Use simple and clear language that would be understandable to someone without technical marketing knowledge."
  ];

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
          This defines how the AI behaves when generating content. Use English for best results, even when you want outputs in other languages.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          User Prompt Template
        </h3>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={6}
          placeholder="Template for the user prompt with variables"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          This is the template for what will be sent to the AI. Use {"{{variables}}"} for dynamic content.
        </p>
        
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="language-examples">
            <AccordionTrigger>
              <div className="flex items-center">
                <span>
                  Example language instructions
                </span>
                <Badge variant="outline" className="ml-2">
                  Helpful
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 py-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Include these examples at the beginning or end of your user prompt to control output language:
                </p>
                {languageInstructionExamples.map((example, index) => (
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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Prompt</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
