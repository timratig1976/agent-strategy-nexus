
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import { LanguageSelector } from "@/components/ui/language-selector";
import { OutputLanguage } from "@/services/ai/types";

interface AIPromptSettingsProps {
  module: string;
  title: string;
  description: string;
}

export const AIPromptSettings: React.FC<AIPromptSettingsProps> = ({
  module,
  title,
  description
}) => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [language, setLanguage] = useState<OutputLanguage>('english');

  useEffect(() => {
    fetchPromptData();
  }, [module, language]);

  const fetchPromptData = async () => {
    setIsLoading(true);
    try {
      // Use the module name with _de suffix for German language
      const moduleWithLanguage = language === 'deutsch' 
        ? `${module}_de` 
        : module;
      
      console.log(`Fetching prompt data for module: ${moduleWithLanguage}`);
      
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("system_prompt, user_prompt")
        .eq("module", moduleWithLanguage)
        .maybeSingle();

      if (error) {
        console.error("Error fetching prompt data:", error);
        toast.error(language === 'english' ? "Failed to load prompt data" : "Fehler beim Laden der Prompt-Daten");
      } else if (data) {
        setSystemPrompt(data.system_prompt || "");
        setUserPrompt(data.user_prompt || "");
      } else {
        // If no data found for German version, notify the user
        if (language === 'deutsch') {
          toast.info("Kein deutscher Prompt gefunden. Erstelle einen neuen.");
          setSystemPrompt("");
          setUserPrompt("");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(language === 'english' ? "Failed to load prompt data" : "Fehler beim Laden der Prompt-Daten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!systemPrompt.trim() || !userPrompt.trim()) {
      toast.error(language === 'english' 
        ? "Both system and user prompts are required" 
        : "Sowohl System- als auch Benutzer-Prompts sind erforderlich");
      return;
    }

    // Use the module name with _de suffix for German language
    const moduleWithLanguage = language === 'deutsch'
      ? `${module}_de`
      : module;

    setIsSaving(true);
    try {
      // Check if the prompt already exists
      const { data: existingPrompt, error: checkError } = await supabase
        .from("ai_prompts")
        .select("id")
        .eq("module", moduleWithLanguage)
        .maybeSingle();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingPrompt) {
        // Update existing prompt
        result = await supabase
          .from("ai_prompts")
          .update({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString(),
          })
          .eq("module", moduleWithLanguage);
      } else {
        // Insert new prompt
        result = await supabase
          .from("ai_prompts")
          .insert({
            module: moduleWithLanguage,
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString(),
          });
      }

      if (result.error) throw result.error;
      
      toast.success(language === 'english' 
        ? "AI prompt updated successfully" 
        : "AI-Prompt erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error(language === 'english' 
        ? "Failed to update AI prompt" 
        : "Fehler beim Aktualisieren des AI-Prompts");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

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
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default AIPromptSettings;
