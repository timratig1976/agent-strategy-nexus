
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MarketingAIService } from "@/services/marketingAIService";
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";
import { StrategyBriefingProps, StrategyMetadata } from "./types";
import StrategyInfoCard from "./StrategyInfoCard";
import BriefingResultCard from "./BriefingResultCard";
import WebsiteCrawlerWrapper from "./WebsiteCrawlerWrapper";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { Progress } from "@/components/ui/progress";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showCrawler, setShowCrawler] = useState<boolean>(false);
  const [crawlResults, setCrawlResults] = useState<WebsiteCrawlResult | undefined>();
  const [formValues, setFormValues] = useState<StrategyFormValues>({
    name: strategy.name,
    description: strategy.description || '',
    companyName: '',
    websiteUrl: '',
    productDescription: '',
    productUrl: '',
    additionalInfo: ''
  });

  // Fetch strategy metadata
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_strategy_metadata', { strategy_id_param: strategy.id });
          
        if (error) throw error;
        
        if (data && Array.isArray(data) && data.length > 0) {
          const metadata = data[0] as StrategyMetadata;
          setFormValues(prevFormValues => ({
            ...prevFormValues,
            companyName: metadata.company_name || '',
            websiteUrl: metadata.website_url || '',
            productDescription: metadata.product_description || '',
            productUrl: metadata.product_url || '',
            additionalInfo: metadata.additional_info || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching strategy metadata:", error);
        toast.error("Failed to load strategy details");
      }
    };
    
    fetchFormData();
  }, [strategy.id, strategy.name, strategy.description]);
  
  // Function to generate AI briefing with progress updates
  const generateBriefing = async () => {
    try {
      setIsGenerating(true);
      setProgress(10);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
      
      const { data, error } = await MarketingAIService.generateContent<AgentResult>(
        'briefing',
        'generate',
        {
          strategyId: strategy.id,
          formData: formValues
        }
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) throw new Error(error);
      
      toast.success("AI Briefing generated successfully");
      
      // Wait a moment before refreshing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Error generating briefing:", error);
      toast.error("Failed to generate AI briefing");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to update strategy metadata
  const saveStrategyMetadata = async (updatedValues: StrategyFormValues): Promise<boolean> => {
    try {
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
  const saveAgentResult = async (updatedResult: AgentResult): Promise<boolean> => {
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
      {isGenerating && (
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>Generating AI briefing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {showCrawler ? (
            <WebsiteCrawlerWrapper 
              onBack={() => setShowCrawler(false)}
              crawlResults={crawlResults}
              setCrawlResults={setCrawlResults}
            />
          ) : (
            <StrategyInfoCard 
              formValues={formValues}
              saveStrategyMetadata={saveStrategyMetadata}
              showCrawler={showCrawler}
              setShowCrawler={setShowCrawler}
            />
          )}
        </div>

        <BriefingResultCard 
          latestBriefing={latestBriefing}
          isGenerating={isGenerating}
          generateBriefing={generateBriefing}
          saveAgentResult={saveAgentResult}
        />
      </div>
    </div>
  );
};

export default StrategyBriefing;
