
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StrategyFormValues } from "@/components/strategy-form";
import { StrategyBriefingProps } from "./types";
import StrategyInfoCard from "./components/strategy-info/StrategyInfoCard";
import WebsiteCrawlerWrapper from "./WebsiteCrawlerWrapper";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { useBriefingGenerator } from "./hooks/useBriefingGenerator";
import { BriefingProgressBar } from "./components";
import { BriefingResult } from "./components/briefing-result/BriefingResult";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
  const navigate = useNavigate();
  const [showCrawler, setShowCrawler] = useState<boolean>(false);
  const [crawlResults, setCrawlResults] = useState<WebsiteCrawlResult | undefined>();
  
  // Initialize form values with empty strings and include the strategy id
  const [formValues, setFormValues] = useState<StrategyFormValues & { id: string }>({
    id: strategy.id,
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
    saveAgentResult,
    briefingHistory,
    setBriefingHistory
  } = useBriefingGenerator(strategy.id);

  // Fetch strategy metadata
  useEffect(() => {
    fetchStrategyMetadata();
  }, [strategy.id]);
  
  const fetchStrategyMetadata = async () => {
    try {
      console.log("Fetching strategy metadata for ID:", strategy.id);
      
      // First check if the strategy has direct properties we can use
      const { data: strategyData, error: strategyError } = await supabase
        .from('strategies')
        .select('company_name, website_url, product_description, product_url, additional_info')
        .eq('id', strategy.id)
        .single();
        
      // Get strategy data values first
      let companyName = '';
      let websiteUrl = '';
      let productDescription = '';
      let productUrl = '';
      let additionalInfo = '';
      
      // Set values from strategies table if available
      if (!strategyError && strategyData) {
        console.log("Found strategy data in strategies table:", strategyData);
        companyName = strategyData.company_name || '';
        websiteUrl = strategyData.website_url || '';
        productDescription = strategyData.product_description || '';
        productUrl = strategyData.product_url || '';
        additionalInfo = strategyData.additional_info || '';
      }
      
      // Then try to get metadata from the strategy_metadata table via RPC
      const { data, error } = await supabase.rpc(
        'get_strategy_metadata',
        { strategy_id_param: strategy.id }
      );
      
      if (error) {
        console.error("RPC error:", error);
        toast.error("Error loading strategy information");
      } else if (data && Array.isArray(data) && data.length > 0) {
        console.log("Metadata response:", data);
        
        // Use metadata values if available (they override strategy table values)
        const metadata = data[0];
        console.log("Setting form values with metadata:", metadata);
        
        // Override values with metadata if they exist
        if (metadata.company_name !== null) companyName = metadata.company_name;
        if (metadata.website_url !== null) websiteUrl = metadata.website_url;
        if (metadata.product_description !== null) productDescription = metadata.product_description;
        if (metadata.product_url !== null) productUrl = metadata.product_url;
        if (metadata.additional_info !== null) additionalInfo = metadata.additional_info;
      }
      
      console.log("Setting final form values:", {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description || '',
        companyName,
        websiteUrl,
        productDescription,
        productUrl,
        additionalInfo
      });
      
      // Set all form values at once with the most up-to-date data
      setFormValues({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description || '',
        companyName,
        websiteUrl,
        productDescription,
        productUrl,
        additionalInfo
      });
      
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
      setFormValues({
        ...updatedValues,
        id: strategy.id
      });
      toast.success("Strategy information updated");
      return true;
    } catch (error) {
      console.error("Error updating strategy metadata:", error);
      toast.error("Failed to update strategy information");
      return false;
    }
  };

  // Find the latest briefing from the history or use the first result from agentResults
  const latestBriefing = briefingHistory.length > 0 
    ? briefingHistory[0] 
    : (agentResults && agentResults.length > 0 ? agentResults[0] : null);

  // Navigate to persona development
  const goToNextStep = () => {
    // First, try to update the strategy state to persona
    supabase
      .from('strategies')
      .update({ state: 'persona' })
      .eq('id', strategy.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating strategy state:", error);
          toast.error("Failed to update strategy state");
        } else {
          // Navigate to the persona development page
          navigate(`/strategy/${strategy.id}?tab=personas`);
          toast.success("Moving to persona development");
        }
      });
  };

  return (
    <div className="space-y-6">
      {isGenerating && (
        <BriefingProgressBar progress={progress} />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Strategy Briefing</h2>
        <Button 
          onClick={goToNextStep}
          className="flex items-center"
        >
          Next: Persona Development <ArrowRight className="ml-2" />
        </Button>
      </div>
      
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

        <BriefingResult 
          latestBriefing={latestBriefing}
          isGenerating={isGenerating}
          generateBriefing={() => generateBriefing(formValues)}
          saveAgentResult={saveAgentResult}
          briefingHistory={briefingHistory}
          setBriefingHistory={setBriefingHistory}
        />
      </div>
    </div>
  );
};

export default StrategyBriefing;
