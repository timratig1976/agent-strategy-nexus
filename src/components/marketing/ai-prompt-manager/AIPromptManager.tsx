
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { AIPrompt, MarketingAIService } from "@/services/marketingAIService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MODULE_OPTIONS } from "./constants";
import ModuleSelector from "./ModuleSelector";
import PromptForm from "./PromptForm";
import SaveButton from "./SaveButton";
import LoadingIndicator from "./LoadingIndicator";

const AIPromptManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("contentStrategy");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);

  // Fetch all prompts on component mount
  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await MarketingAIService.getPrompts();
        if (response.data) {
          setPrompts(response.data);
        } else if (response.error) {
          toast({
            title: "Error",
            description: `Failed to fetch prompts: ${response.error}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [user, toast]);

  // Load selected module's prompt
  useEffect(() => {
    const loadSelectedPrompt = async () => {
      if (!selectedModule) return;
      
      setIsLoading(true);
      try {
        const response = await MarketingAIService.getPromptByModule(selectedModule);
        
        if (response.data) {
          setSystemPrompt(response.data.systemPrompt);
          setUserPrompt(response.data.userPrompt);
        } else {
          // If no prompt found for this module, set defaults
          const basePrompt = "You are an expert marketing strategist AI assistant helping to create professional marketing content.";
          setSystemPrompt(basePrompt);
          setUserPrompt("");
        }
      } catch (error) {
        console.error("Error loading prompt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedPrompt();
  }, [selectedModule]);

  const handleSave = async () => {
    if (!user || !selectedModule) return;

    setIsSaving(true);
    try {
      const response = await MarketingAIService.savePrompt({
        module: selectedModule,
        systemPrompt,
        userPrompt
      });

      if (response.data) {
        // Update local prompts list
        const updatedPrompts = [...prompts];
        const existingIndex = updatedPrompts.findIndex(p => p.module === selectedModule);
        
        if (existingIndex >= 0) {
          updatedPrompts[existingIndex] = response.data;
        } else {
          updatedPrompts.push(response.data);
        }
        
        setPrompts(updatedPrompts);
        
        toast({
          title: "Success",
          description: "Prompt saved successfully",
        });
      } else if (response.error) {
        toast({
          title: "Error",
          description: `Failed to save prompt: ${response.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromptChange = (field: 'systemPrompt' | 'userPrompt', value: string) => {
    if (field === 'systemPrompt') {
      setSystemPrompt(value);
    } else {
      setUserPrompt(value);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>You need to be logged in to manage AI prompts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Prompt Manager</CardTitle>
        <CardDescription>
          Customize the prompts used by marketing AI modules when generating content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ModuleSelector 
          selectedModule={selectedModule} 
          moduleOptions={MODULE_OPTIONS} 
          isLoading={isLoading} 
          onModuleChange={setSelectedModule} 
        />

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <PromptForm 
            systemPrompt={systemPrompt} 
            userPrompt={userPrompt} 
            isLoading={isLoading} 
            onChange={handlePromptChange} 
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <SaveButton 
          isSaving={isSaving} 
          isLoading={isLoading} 
          onSave={handleSave} 
        />
      </CardFooter>
    </Card>
  );
};

export default AIPromptManager;
