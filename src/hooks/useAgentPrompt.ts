
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgentCoreService } from '@/services/ai/agentCoreService';

/**
 * Hook for managing AI agent prompts with automatic fallback and creation
 */
export const useAgentPrompt = (module: string) => {
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [promptSource, setPromptSource] = useState<'database' | 'default' | 'none'>('none');
  const [error, setError] = useState<string | null>(null);

  // Load prompt with fallback mechanism
  const loadPrompt = useCallback(async () => {
    if (!module) {
      setError("No module specified");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get prompt with fallbacks 
      const prompt = await AgentCoreService.getPrompts(module);
      
      if (prompt) {
        setSystemPrompt(prompt.system_prompt);
        setUserPrompt(prompt.user_prompt);
        setPromptSource(prompt.source);
      } else {
        setSystemPrompt("");
        setUserPrompt("");
        setPromptSource('none');
        setError(`No prompts available for module: ${module}`);
      }
    } catch (err: any) {
      console.error("Error loading prompts:", err);
      setError(err.message || "Failed to load prompts");
    } finally {
      setIsLoading(false);
    }
  }, [module]);

  // Load prompts on mount and when module changes
  useEffect(() => {
    loadPrompt();
  }, [module, loadPrompt]);

  // Ensure prompt exists
  const ensurePromptExists = useCallback(async (): Promise<boolean> => {
    if (!module) return false;
    
    try {
      const result = await AgentCoreService.ensurePromptsExist(module);
      
      // If prompts were created, reload them
      if (result && promptSource === 'none') {
        await loadPrompt();
      }
      
      return result;
    } catch (err) {
      console.error("Error ensuring prompt exists:", err);
      return false;
    }
  }, [module, loadPrompt, promptSource]);

  // Save prompt to database
  const savePrompt = useCallback(async (): Promise<boolean> => {
    if (!module || !systemPrompt.trim() || !userPrompt.trim()) {
      toast.error("Module name, system prompt, and user prompt are required");
      return false;
    }

    setIsSaving(true);
    try {
      // Check if the prompt already exists
      const { data: existingData } = await supabase
        .from("ai_prompts")
        .select("id")
        .eq("module", module)
        .single();

      let result;
      
      if (existingData) {
        // Update existing prompt
        result = await supabase
          .from("ai_prompts")
          .update({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            updated_at: new Date().toISOString(),
          })
          .eq("module", module);
      } else {
        // Insert new prompt
        result = await supabase
          .from("ai_prompts")
          .insert({
            module,
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
          });
      }

      if (result.error) {
        throw result.error;
      }

      setPromptSource('database');
      toast.success("Prompt saved successfully");
      return true;
    } catch (error: any) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt: " + error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [module, systemPrompt, userPrompt]);

  // Reset to default prompt
  const resetToDefault = useCallback(async () => {
    if (!module) return;
    
    const defaultTemplates = AgentCoreService.getDefaultPromptTemplates?.(module);
    if (defaultTemplates) {
      setSystemPrompt(defaultTemplates.system_prompt);
      setUserPrompt(defaultTemplates.user_prompt);
      toast.success("Prompts reset to default template");
    } else {
      toast.error("No default template found for this module");
    }
  }, [module]);

  return {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    promptSource,
    error,
    loadPrompt,
    savePrompt,
    resetToDefault,
    ensurePromptExists
  };
};
