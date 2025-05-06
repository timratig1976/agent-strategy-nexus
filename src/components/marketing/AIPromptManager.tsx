
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { AIPrompt, MarketingAIService } from "@/services/marketingAIService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const moduleOptions = [
  { value: 'contentStrategy', label: 'Content Strategy' },
  { value: 'uspGenerator', label: 'USP Generator' },
  { value: 'campaignIdeas', label: 'Campaign Ideas' },
  { value: 'leadMagnets', label: 'Lead Magnets' },
  { value: 'adCreative', label: 'Ad Creative' },
  { value: 'channelStrategy', label: 'Channel Strategy' },
];

export const AIPromptManager: React.FC = () => {
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Module</label>
          <Select
            value={selectedModule}
            onValueChange={setSelectedModule}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a module" />
            </SelectTrigger>
            <SelectContent>
              {moduleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">System Prompt</label>
              <Textarea
                placeholder="Enter system prompt (instructions for the AI)"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The system prompt defines the AI's behavior and expertise.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User Prompt Template</label>
              <Textarea
                placeholder="Enter the user prompt template"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use variables like &#123;&#123;keyword&#125;&#125; that will be replaced with user input.
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Prompt"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIPromptManager;
