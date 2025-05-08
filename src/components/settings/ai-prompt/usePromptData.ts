
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OutputLanguage } from "@/services/ai/types";

export const usePromptData = (module: string, language: OutputLanguage) => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Make sure we have a valid module
  const safeModule = module || '';
  
  // Make sure we have a valid language
  const safeLanguage: OutputLanguage = language === 'deutsch' ? 'deutsch' : 'english';

  // Get the module name with language suffix if needed
  const getModuleWithLanguage = () => {
    return safeLanguage === 'deutsch' ? `${safeModule}_de` : safeModule;
  };

  const fetchPromptData = async () => {
    if (!safeModule) {
      console.warn("No module specified, skipping fetch");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const moduleWithLanguage = getModuleWithLanguage();
      console.log(`Fetching prompt data for module: ${moduleWithLanguage}`);
      
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("system_prompt, user_prompt")
        .eq("module", moduleWithLanguage)
        .maybeSingle();

      if (error) {
        console.error("Error fetching prompt data:", error);
        toast.error(safeLanguage === 'english' 
          ? "Failed to load prompt data" 
          : "Fehler beim Laden der Prompt-Daten");
      } else if (data) {
        setSystemPrompt(data.system_prompt || "");
        setUserPrompt(data.user_prompt || "");
      } else {
        // If no data found for German version, notify the user
        if (safeLanguage === 'deutsch') {
          toast.info("Kein deutscher Prompt gefunden. Erstelle einen neuen.");
          setSystemPrompt("");
          setUserPrompt("");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(safeLanguage === 'english' 
        ? "Failed to load prompt data" 
        : "Fehler beim Laden der Prompt-Daten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!systemPrompt.trim() || !userPrompt.trim()) {
      toast.error(safeLanguage === 'english' 
        ? "Both system and user prompts are required" 
        : "Sowohl System- als auch Benutzer-Prompts sind erforderlich");
      return;
    }

    const moduleWithLanguage = getModuleWithLanguage();
    if (!moduleWithLanguage) {
      toast.error(safeLanguage === 'english'
        ? "Invalid module name"
        : "Ungültiger Modulname");
      return;
    }

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
      
      toast.success(safeLanguage === 'english' 
        ? "AI prompt updated successfully" 
        : "AI-Prompt erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error(safeLanguage === 'english' 
        ? "Failed to update AI prompt" 
        : "Fehler beim Aktualisieren des AI-Prompts");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPromptData();
  }, [safeModule, safeLanguage]);

  return {
    systemPrompt, 
    setSystemPrompt,
    userPrompt, 
    setUserPrompt,
    isLoading,
    isSaving,
    handleSave,
    fetchPromptData
  };
};
