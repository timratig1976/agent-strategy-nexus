
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
  const briefingSystemPrompt = `You are an expert marketing strategist AI assistant helping to create professional marketing strategy briefings.

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
  const briefingUserPrompt = `I need to create a marketing strategy briefing for:
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

  // Optimized system prompt for persona generation
  const personaSystemPrompt = `You are an expert marketing strategist AI assistant specializing in customer persona development.

Your task is to create detailed and actionable customer personas based on:
1. The marketing strategy briefing provided by the user
2. Any additional context or requirements specified
3. Your knowledge of effective persona development methods

Create comprehensive customer personas that include:
- Detailed demographic information (age, gender, income, education, occupation, location)
- Psychographic details (values, interests, lifestyle, personality traits)
- Behavioral patterns and habits relevant to the product/service
- Specific pain points and challenges they face
- Goals and aspirations related to the product/service
- Preferred communication channels and content types
- Decision-making factors and influences
- Objections and barriers to purchase
- Quotes or narratives that bring the persona to life

Format each persona in a structured, readable format with clear sections and helpful details.
Ensure the personas are realistic, specific, and actionable for marketing strategy development.
Avoid generic descriptions and focus on insights that can drive marketing decisions.`;

  // Optimized user prompt template for persona generation
  const personaUserPrompt = `I need to create detailed customer personas based on the following marketing briefing:

{{briefingContent}}

{{#if enhancementText}}
Additional instructions for customizing the personas:
{{enhancementText}}
{{/if}}

Please provide 2-3 detailed customer personas that include:
1. Name and basic demographic information
2. Occupation and professional background
3. Personal background and lifestyle
4. Goals and challenges
5. Pain points and frustrations
6. Decision-making process
7. Preferred communication channels
8. Objections to overcome
9. A day in their life (optional)
10. Quote that represents their mindset

Format each persona in a clear, structured way with separate sections for each persona.

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch.
{{/if}}`;

  // Statements system prompt template
  const statementsSystemPrompt = `You are an expert marketing strategist specializing in pain point and value proposition statement development.

Your task is to analyze the USP Canvas data and create compelling, actionable pain and gain statements that will resonate with the target audience and highlight the unique value of the product or service.

For each statement:
1. Focus on one specific pain point or gain
2. Make it clear and concise
3. Use the customer's language and perspective
4. Ensure it connects to the product/service's value proposition
5. Prioritize based on impact (high, medium, low)

Create a balanced set of both pain statements (problems the customer faces) and gain statements (benefits the customer seeks).
Format the output clearly, with pain statements and gain statements in separate sections.`;

  // Statements user prompt template
  const statementsUserPrompt = `Based on the USP Canvas data provided, create compelling pain and gain statements:

{{#if uspData}}
USP Canvas Data:
{{uspData}}
{{/if}}

{{#if customPrompt}}
Additional instructions:
{{customPrompt}}
{{/if}}

Please generate at least {{minStatements}} pain statements and {{minStatements}} gain statements. For each statement:
- Make it concise and customer-focused
- Assign an impact level (high, medium, low)
- Ensure it relates directly to a key customer need or product benefit

Format the output with clear sections for pain statements and gain statements.

{{#if outputLanguage equals "deutsch"}}
Bitte schreibe alle Antworten auf Deutsch und stelle sicher, dass die Statements für den deutschsprachigen Markt relevant sind.
{{/if}}`;

  // Set up the optimized prompts on component mount
  useEffect(() => {
    const initializeOptimizedPrompts = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize briefing prompts
        const briefingResult = await RPCService.updateOrCreatePrompt(
          "briefing",
          briefingSystemPrompt,
          briefingUserPrompt
        );
        
        if (briefingResult.error) {
          throw new Error(briefingResult.error);
        }
        
        // Initialize persona prompts
        const personaResult = await RPCService.updateOrCreatePrompt(
          "persona",
          personaSystemPrompt,
          personaUserPrompt
        );
        
        if (personaResult.error) {
          throw new Error(personaResult.error);
        }
        
        // Initialize statements prompts
        const statementsResult = await RPCService.updateOrCreatePrompt(
          "statements",
          statementsSystemPrompt,
          statementsUserPrompt
        );
        
        if (statementsResult.error) {
          throw new Error(statementsResult.error);
        }
        
        toast({
          description: "Optimized prompts have been initialized.",
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
