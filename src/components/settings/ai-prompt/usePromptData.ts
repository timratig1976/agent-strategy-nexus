
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OutputLanguage } from "@/services/ai/types";

export const usePromptData = (module: string) => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Make sure we have a valid module
  const safeModule = module || '';

  const fetchPromptData = async () => {
    if (!safeModule) {
      console.warn("No module specified, skipping fetch");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching prompt data for module: ${safeModule}`);
      
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("system_prompt, user_prompt")
        .eq("module", safeModule)
        .maybeSingle();

      if (error) {
        console.error("Error fetching prompt data:", error);
        toast.error("Failed to load prompt data");
      } else if (data) {
        setSystemPrompt(data.system_prompt || "");
        setUserPrompt(data.user_prompt || "");
      } else {
        // If no data found, initialize with empty prompts
        setSystemPrompt("");
        setUserPrompt("");
        toast.info("No prompt found. Create a new one.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load prompt data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (outputLanguage: OutputLanguage = 'english') => {
    if (!systemPrompt.trim() || !userPrompt.trim()) {
      toast.error("Both system and user prompts are required");
      return;
    }

    if (!safeModule) {
      toast.error("Invalid module name");
      return;
    }

    setIsSaving(true);
    try {
      // Check if the prompt already exists
      const { data: existingPrompt, error: checkError } = await supabase
        .from("ai_prompts")
        .select("id")
        .eq("module", safeModule)
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
          .eq("module", safeModule);
      } else {
        // Insert new prompt
        result = await supabase
          .from("ai_prompts")
          .insert({
            module: safeModule,
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString(),
          });
      }

      if (result.error) throw result.error;
      
      const successMessage = outputLanguage === 'english' 
        ? "AI prompt updated successfully" 
        : "AI-Prompt erfolgreich aktualisiert";
        
      toast.success(successMessage);
    } catch (error) {
      console.error("Error saving prompt:", error);
      
      const errorMessage = outputLanguage === 'english' 
        ? "Failed to update AI prompt" 
        : "Fehler beim Aktualisieren des AI-Prompts";
        
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPromptData();
  }, [safeModule]);

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
