
import { useState, useCallback } from "react";
import { WebsiteCrawlResult, FirecrawlService } from "@/services/firecrawl";

/**
 * Hook to load saved crawl results from database using the storage service
 */
export const useSavedCrawlResults = () => {
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  
  const loadSavedCrawlResults = useCallback(async (strategyId: string) => {
    if (!strategyId) return;
    
    try {
      console.log("Loading saved crawl results for strategy:", strategyId);
      
      // Load website crawl results using the storage service
      const websiteResults = await FirecrawlService.getLatestCrawlResult(strategyId, 'website');
      
      if (websiteResults) {
        console.log("Found saved website crawl result:", websiteResults);
        setWebsitePreviewResults(websiteResults);
      } else {
        console.log("No website crawl results found for strategy:", strategyId);
      }
      
      // Load product crawl results using the storage service
      const productResults = await FirecrawlService.getLatestCrawlResult(strategyId, 'product');
      
      if (productResults) {
        console.log("Found saved product crawl result:", productResults);
        setProductPreviewResults(productResults);
      } else {
        console.log("No product crawl results found for strategy:", strategyId);
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
