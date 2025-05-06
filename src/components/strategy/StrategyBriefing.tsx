
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AgentResult, Strategy } from "@/types/marketing";
import { AIResultEditor } from "@/components/marketing/shared/AIResultEditor";
import { supabase } from "@/integrations/supabase/client";
import { StrategyFormValues } from "@/components/strategy-form";
import { WebsiteCrawlingModule } from "@/components/marketing/modules/website-crawler";
import { MarketingAIService } from "@/services/marketingAIService";

interface StrategyBriefingProps {
  strategy: Strategy;
  agentResults: AgentResult[];
}

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ strategy, agentResults }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCrawler, setShowCrawler] = useState(false);
  const [formValues, setFormValues] = useState<StrategyFormValues>({
    name: strategy.name,
    description: strategy.description,
    companyName: '',
    websiteUrl: '',
    productDescription: '',
    productUrl: '',
    additionalInfo: ''
  });

  // Fetch strategy form data
  React.useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Using raw SQL query to get around type issues with the strategy_metadata table
        const { data, error } = await supabase
          .rpc('get_strategy_metadata', { strategy_id_param: strategy.id });
          
        if (error) throw error;
        
        if (data) {
          setFormValues({
            name: strategy.name,
            description: strategy.description,
            companyName: data.company_name || '',
            websiteUrl: data.website_url || '',
            productDescription: data.product_description || '',
            productUrl: data.product_url || '',
            additionalInfo: data.additional_info || ''
          });
        }
      } catch (error) {
        console.error("Error fetching strategy metadata:", error);
        toast.error("Failed to load strategy details");
      }
    };
    
    fetchFormData();
  }, [strategy.id, strategy.name, strategy.description]);
  
  // Function to generate AI briefing
  const generateBriefing = async () => {
    try {
      setIsGenerating(true);
      
      // Call the AI service to generate briefing
      const { data, error } = await MarketingAIService.generateContent<AgentResult>(
        'briefing',
        'generate',
        {
          strategyId: strategy.id,
          formData: formValues
        }
      );
      
      if (error) throw new Error(error);
      
      // Refresh the page to show new results
      toast.success("AI Briefing generated successfully");
      
      // Wait a moment before refreshing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate AI briefing");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to update strategy metadata
  const saveStrategyMetadata = async (updatedValues: StrategyFormValues) => {
    try {
      // Using raw SQL again via RPC for consistency
      const { error } = await supabase
        .rpc('upsert_strategy_metadata', {
          strategy_id_param: strategy.id,
          company_name_param: updatedValues.companyName,
          website_url_param: updatedValues.websiteUrl,
          product_description_param: updatedValues.productDescription,
          product_url_param: updatedValues.productUrl,
          additional_info_param: updatedValues.additionalInfo
        });
      
      if (error) throw error;
      
      setFormValues(updatedValues);
      toast.success("Strategy information updated");
      return true;
    } catch (error) {
      console.error("Error updating strategy metadata:", error);
      toast.error("Failed to update strategy information");
      return false;
    }
  };
  
  // Save agent result changes
  const saveAgentResult = async (updatedResult: AgentResult) => {
    try {
      const { error } = await supabase
        .from('agent_results')
        .update({
          content: updatedResult.content,
          metadata: { 
            ...updatedResult.metadata,
            manually_edited: true,
            edited_at: new Date().toISOString()
          }
        })
        .eq('id', updatedResult.id);
      
      if (error) throw error;
      
      toast.success("Briefing content updated");
      return true;
    } catch (error) {
      console.error("Error updating agent result:", error);
      toast.error("Failed to update briefing content");
      return false;
    }
  };
  
  // Find the latest briefing result
  const latestBriefing = agentResults.length > 0 ? agentResults[0] : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Strategy Information</span>
              {!showCrawler && formValues.websiteUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCrawler(true)}
                  className="flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span>Crawl Website</span>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showCrawler ? (
              <div className="space-y-4">
                <WebsiteCrawlingModule />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCrawler(false)}
                  className="mt-4"
                >
                  Back to Strategy
                </Button>
              </div>
            ) : (
              <AIResultEditor 
                title="Strategy Details"
                description="Edit strategy information to improve AI briefing"
                originalContent={formValues}
                contentField="content"
                onSave={(updatedContent) => saveStrategyMetadata(updatedContent.content)}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Briefing</span>
              <Button 
                onClick={generateBriefing}
                disabled={isGenerating}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? "Generating..." : latestBriefing ? "Regenerate" : "Generate"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestBriefing ? (
              <AIResultEditor 
                title="Edit Briefing"
                description="Fine-tune the AI-generated content"
                originalContent={latestBriefing}
                contentField="content"
                onSave={saveAgentResult}
              />
            ) : (
              <div className="p-6 text-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  No briefing has been generated yet. Click 'Generate' to create an AI briefing based on the strategy information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyBriefing;
