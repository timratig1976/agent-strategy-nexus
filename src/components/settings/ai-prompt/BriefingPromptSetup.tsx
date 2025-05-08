
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RPCService } from "@/services/ai/rpcService";

export const BriefingPromptSetup: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await RPCService.updateOrCreatePrompt(
        "briefing",
        systemPrompt,
        userPrompt
      );
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Briefing prompts updated",
        description: "The AI briefing prompts have been successfully updated.",
      });
    } catch (err) {
      console.error("Error updating prompts:", err);
      toast({
        title: "Error updating prompts",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-md mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Update Briefing Prompts</h3>
        <p className="text-sm text-muted-foreground">
          Install optimized prompts for generating marketing briefings that incorporate website data.
        </p>
      </div>
      
      <Button 
        onClick={handleUpdate} 
        disabled={isUpdating}
        className="flex items-center gap-2"
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Install Optimized Prompts</span>
          </>
        )}
      </Button>
    </div>
  );
};
