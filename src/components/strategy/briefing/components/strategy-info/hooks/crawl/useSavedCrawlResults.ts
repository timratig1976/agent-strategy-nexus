
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { ExtractedContent, WebsiteCrawlRecord } from "./types";

/**
 * Hook to load saved crawl results from database
 */
export const useSavedCrawlResults = () => {
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  
  const loadSavedCrawlResults = useCallback(async (strategyId: string) => {
    if (!strategyId) return;
    
    try {
      console.log("Loading saved crawl results for strategy:", strategyId);
      
      // Query the website_crawls table for the website URL crawl
      const { data: websiteData, error: websiteError } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('project_id', strategyId)
        .eq('extracted_content->>url_type', 'website')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (websiteError) {
        console.error("Error loading website crawl results:", websiteError);
      } else if (websiteData && websiteData.length > 0) {
        console.log("Found saved website crawl result:", websiteData[0]);
        
        // Safely access properties with type checking
        const extractedContent = websiteData[0].extracted_content as ExtractedContent;
        
        // Convert from DB format to WebsiteCrawlResult
        const websiteResult: WebsiteCrawlResult = {
          success: true,
          pagesCrawled: 1,
          contentExtracted: true,
          summary: extractedContent?.summary || "",
          keywordsFound: extractedContent?.keywords || [],
          technologiesDetected: [],
          data: extractedContent?.data || [],
          url: websiteData[0].url,
          id: websiteData[0].id,
          strategyId
        };
        setWebsitePreviewResults(websiteResult);
      }
      
      // Query the website_crawls table for the product URL crawl
      const { data: productData, error: productError } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('project_id', strategyId)
        .eq('extracted_content->>url_type', 'product')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (productError) {
        console.error("Error loading product crawl results:", productError);
      } else if (productData && productData.length > 0) {
        console.log("Found saved product crawl result:", productData[0]);
        
        // Safely access properties with type checking
        const extractedContent = productData[0].extracted_content as ExtractedContent;
        
        // Convert from DB format to WebsiteCrawlResult
        const productResult: WebsiteCrawlResult = {
          success: true,
          pagesCrawled: 1,
          contentExtracted: true,
          summary: extractedContent?.summary || "",
          keywordsFound: extractedContent?.keywords || [],
          technologiesDetected: [],
          data: extractedContent?.data || [],
          url: productData[0].url,
          id: productData[0].id,
          strategyId
        };
        setProductPreviewResults(productResult);
      }
    } catch (error) {
      console.error("Error loading saved crawl results:", error);
    }
  }, []);

  return {
    websitePreviewResults,
    setWebsitePreviewResults,
    productPreviewResults,
    setProductPreviewResults,
    loadSavedCrawlResults
  };
};
