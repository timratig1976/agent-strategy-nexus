
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";
import { useApiClient } from "@/hooks/useApiClient";

export const usePromptData = (module: string) => {
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const api = useApiClient("");

  useEffect(() => {
    const fetchPromptData = async () => {
      if (!module) return;

      try {
        setIsLoading(true);
        const res = await api.get<{ system_prompt: string; user_prompt: string }>(`/api/ai-prompts?module=${encodeURIComponent(module)}`);
        setSystemPrompt(res.system_prompt || "");
        setUserPrompt(res.user_prompt || "");
      } catch (error: any) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load prompt data: " + error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromptData();
  }, [module, toast]);

  const handleSave = async (outputLanguage: string = 'english') => {
    if (!module) {
      toast({
        title: "Error",
        description: "No module specified",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await api.post(`/api/ai-prompts`, {
        module,
        system_prompt: systemPrompt,
        user_prompt: userPrompt,
      });

      toast({
        title: "Success",
        description: "Prompt saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: "Failed to save prompt: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    isLoading,
    isSaving,
    handleSave,
  };
};
