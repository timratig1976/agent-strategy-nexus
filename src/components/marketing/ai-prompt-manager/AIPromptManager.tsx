
import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import ModuleSelector from "./ModuleSelector";
import PromptForm from "./PromptForm";
import SaveButton from "./SaveButton";
import LoadingIndicator from "./LoadingIndicator";
import { MODULE_OPTIONS } from "./constants";

const AIPromptManager: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  // Fetch prompt data when module changes
  useEffect(() => {
    const fetchPromptData = async () => {
      if (!selectedModule) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("ai_prompts")
          .select("system_prompt, user_prompt")
          .eq("module", selectedModule)
          .single();

        if (error) {
          console.error("Error fetching prompt data:", error);
          throw error;
        }

        setSystemPrompt(data?.system_prompt || "");
        setUserPrompt(data?.user_prompt || "");
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load prompt data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromptData();
  }, [selectedModule, toast]);

  const handleModuleChange = (moduleValue: string) => {
    setSelectedModule(moduleValue);
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  const handleUserPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedModule) {
      toast({
        title: "Error",
        description: "Please select a module first",
        variant: "destructive",
      });
      return;
    }

    // Input validation
    if (!systemPrompt.trim()) {
      toast({
        title: "Error",
        description: "System prompt cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!userPrompt.trim()) {
      toast({
        title: "Error",
        description: "User prompt cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          updated_at: new Date().toISOString(),
        })
        .eq("module", selectedModule);

      if (error) throw error;

      toast({
        title: "Prompt Updated",
        description: "The AI prompt has been successfully updated",
      });
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Pencil className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">AI Prompt Manager</h2>
          <p className="text-muted-foreground mt-1">
            Customize the AI prompts used in different modules
          </p>
        </div>
      </div>

      <ModuleSelector 
        selectedModule={selectedModule} 
        onModuleChange={handleModuleChange} 
        moduleOptions={MODULE_OPTIONS}
        isLoading={isLoading}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        selectedModule && (
          <PromptForm 
            systemPrompt={systemPrompt}
            userPrompt={userPrompt}
            isLoading={isLoading}
            onChange={(field, value) => {
              if (field === 'systemPrompt') {
                setSystemPrompt(value);
              } else {
                setUserPrompt(value);
              }
            }}
          />
        )
      )}

      {selectedModule && !isLoading && (
        <div className="mt-6 flex justify-end">
          <SaveButton 
            isSaving={isSaving} 
            onSave={handleSave} 
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default AIPromptManager;
