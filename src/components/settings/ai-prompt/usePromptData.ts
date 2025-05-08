
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";

export const usePromptData = (module: string) => {
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPromptData = async () => {
      if (!module) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("ai_prompts")
          .select("system_prompt, user_prompt")
          .eq("module", module)
          .single();

        if (error) {
          console.error("Error fetching prompt data:", error);
          if (error.code !== 'PGRST116') { // Not found error
            throw error;
          }
          
          // If not found, use empty strings
          setSystemPrompt("");
          setUserPrompt("");
          return;
        }

        setSystemPrompt(data?.system_prompt || "");
        setUserPrompt(data?.user_prompt || "");
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
