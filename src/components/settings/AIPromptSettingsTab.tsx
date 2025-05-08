
import React, { useEffect, useState } from "react";
import { ModulePromptSettings } from "./ai-prompt/ModulePromptSettings";
import { moduleLabels } from "./ai-prompt/config";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RPCService } from "@/services/ai/rpcService";
import { useToast } from "@/components/ui/use-toast";

export const AIPromptSettingsTab: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  // Get all module keys from our configuration and ensure it's not undefined
  const moduleKeys = moduleLabels ? Object.keys(moduleLabels) : [];

  // Improved system prompt for website crawling
  const systemPrompt = `You are an expert marketing strategist AI assistant helping to create professional marketing strategy briefings.

Your task is to synthesize information from multiple sources, including:
1. Form data provided by the user
2. Website content crawled from the company URL (when available)
3. Product description and additional context

Create a comprehensive, well-structured marketing strategy briefing that includes:
- Company and product overview based on the provided information and website data
- Target audience analysis that identifies key demographics and psychographics
- Unique value proposition and competitive positioning
- Key marketing channels and tactics recommended for this specific business
- Strategic approach recommendations tailored to the company's industry and offerings
- Prioritized action items and next steps

Format the briefing in a professional, readable structure with clear sections and bullet points where appropriate.
Maintain a professional tone suitable for marketing experts while being accessible.`;

  // Improved user prompt template with website crawling variables
  const userPrompt = `I need to create a marketing strategy briefing for:
- Strategy ID: {{strategyId}}
- Strategy Name: {{formData.name}}
- Company Name: {{formData.companyName}}
- Website URL: {{formData.websiteUrl}}
- Product/Service Description: {{formData.productDescription}}
- Additional Information: {{formData.additionalInfo}}

{{#if websiteCrawlData}}
Here is additional data extracted from the company's website:
{{websiteCrawlData}}
{{/if}}

Please provide a comprehensive marketing strategy briefing that includes:
1. An overview of the company and its offerings
2. Target audience analysis
3. Key marketing channels to prioritize
4. Key benefits of the product/service to highlight
5. Recommendations for messaging and positioning
6. Call to action and next steps

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch.
{{/if}}`;

  // Set up the optimized prompts on component mount
  useEffect(() => {
    const initializeOptimizedPrompts = async () => {
      try {
        setIsInitializing(true);
        const { data, error } = await RPCService.updateOrCreatePrompt(
          "briefing",
          systemPrompt,
          userPrompt
        );
        
        if (error) {
          throw new Error(error);
        }
        
        toast({
          description: "Optimized briefing prompts have been initialized.",
        });
      } catch (err) {
        console.error("Error initializing optimized prompts:", err);
        toast({
          title: "Error initializing prompts",
          description: err instanceof Error ? err.message : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeOptimizedPrompts();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            AI Prompt Settings
          </h2>
        </div>
        
        <Alert className="bg-muted/50">
          <div className="flex gap-2 items-start">
            <InfoIcon className="h-5 w-5 mt-0.5 text-blue-500" />
            <AlertDescription className="text-sm">
              System prompts work best in English. You can include language instructions in your user prompts if you need responses in other languages.
            </AlertDescription>
          </div>
        </Alert>
      </div>
      
      {moduleKeys.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No modules configured for AI prompt settings
        </div>
      ) : (
        moduleKeys.map((moduleKey) => (
          <ModulePromptSettings
            key={moduleKey}
            module={moduleKey}
          />
        ))
      )}
    </div>
  );
};

export default AIPromptSettingsTab;
