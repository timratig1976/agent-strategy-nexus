
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StrategyFormValues } from "@/components/strategy-form";
import { StrategyBriefingProps } from "./types";
import StrategyInfoCard from "./StrategyInfoCard";
import BriefingResultCard from "./BriefingResultCard";
import WebsiteCrawlerWrapper from "./WebsiteCrawlerWrapper";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { useBriefingGenerator } from "./hooks/useBriefingGenerator";
import { BriefingProgressBar } from "./components";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
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

  const {
    isGenerating,
    progress,
    generateBriefing,
    saveAgentResult
  } = useBriefingGenerator(strategy.id);

  // Fetch strategy metadata
  useEffect(() => {
    fetchStrategyMetadata();
  }, [strategy.id, strategy.name, strategy.description]);
  
  const fetchStrategyMetadata = async () => {
    try {
      console.log("Fetching strategy metadata for ID:", strategy.id);
      
      // Use RPC function to fetch strategy metadata
      const { data, error } = await supabase.rpc(
        'get_strategy_metadata',
        { strategy_id_param: strategy.id }
      );
      
      if (error) {
        console.error("RPC error:", error);
        toast.error("Error loading strategy information");
        return;
      }
      
      console.log("Metadata response:", data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const metadata = data[0];
        console.log("Setting form values with metadata:", metadata);
        
        setFormValues(prevFormValues => ({
          ...prevFormValues,
          companyName: metadata.company_name || '',
          websiteUrl: metadata.website_url || '',
          productDescription: metadata.product_description || '',
          productUrl: metadata.product_url || '',
          additionalInfo: metadata.additional_info || ''
        }));
      } else {
        console.log("No metadata found or empty array returned");
      }
    } catch (error) {
      console.error("Error fetching strategy metadata:", error);
      toast.error("Failed to load strategy information");
    }
  };

  // Function to update strategy metadata
  const saveStrategyMetadata = async (updatedValues: StrategyFormValues): Promise<boolean> => {
    try {
      console.log("Saving strategy metadata for ID:", strategy.id, "Values:", updatedValues);
      
      // Use RPC function to update strategy metadata
      const { error } = await supabase.rpc(
        'upsert_strategy_metadata',
        {
          strategy_id_param: strategy.id,
          company_name_param: updatedValues.companyName || '',
          website_url_param: updatedValues.websiteUrl || '',
          product_description_param: updatedValues.productDescription || '',
          product_url_param: updatedValues.productUrl || '',
          additional_info_param: updatedValues.additionalInfo || ''
        }
      );
      
      if (error) {
        console.error("RPC error during save:", error);
        throw error;
      }
      
      console.log("Strategy metadata updated successfully");
      setFormValues(updatedValues);
      toast.success("Strategy information updated");
      return true;
    } catch (error) {
      console.error("Error updating strategy metadata:", error);
      toast.error("Failed to update strategy information");
      return false;
    }
  };
  
  // Find the latest briefing result
  const latestBriefing = agentResults && agentResults.length > 0 ? agentResults[0] : null;

  return (
    <div className="space-y-6">
      {isGenerating && (
        <BriefingProgressBar progress={progress} />
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
          generateBriefing={() => generateBriefing(formValues)}
          saveAgentResult={saveAgentResult}
        />
      </div>
    </div>
  );
};

export default StrategyBriefing;
