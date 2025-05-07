
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
import { AgentResult } from "@/types/marketing";
import { 
  StrategyMetadataRow,
  GetStrategyMetadataParams,
  UpsertStrategyMetadataParams
} from "./types";

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
      // Fix the RPC call typing
      const { data, error } = await supabase.rpc<StrategyMetadataRow[], GetStrategyMetadataParams>(
        'get_strategy_metadata',
        { strategy_id_param: strategy.id }
      );
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const metadata = data[0];
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

  // Function to update strategy metadata
  const saveStrategyMetadata = async (updatedValues: StrategyFormValues): Promise<boolean> => {
    try {
      // Fix the RPC call typing
      const { error } = await supabase.rpc<void, UpsertStrategyMetadataParams>(
        'upsert_strategy_metadata',
        {
          strategy_id_param: strategy.id,
          company_name_param: updatedValues.companyName,
          website_url_param: updatedValues.websiteUrl,
          product_description_param: updatedValues.productDescription,
          product_url_param: updatedValues.productUrl,
          additional_info_param: updatedValues.additionalInfo
        }
      );
      
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
