
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ScraperClient } from "@/services/firecrawl/scraper-client";
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";

/**
 * Hook to handle crawling operations
 */
export const useCrawlHandler = (
  formValues: StrategyFormValues & { id?: string },
  setWebsitePreviewResults: (results: WebsiteCrawlResult | null) => void,
  setProductPreviewResults: (results: WebsiteCrawlResult | null) => void
) => {
  const [crawlingUrl, setCrawlingUrl] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState<number>(0);
  
  // Handle crawling a URL
  const handleCrawl = useCallback(async (urlType: 'websiteUrl' | 'productUrl'): Promise<{ success: boolean }> => {
    // Get the URL to crawl
    const url = formValues[urlType];
    if (!url) {
      toast.error(`Please enter a ${urlType === 'websiteUrl' ? 'website' : 'product'} URL`);
      return { success: false };
    }

    // Check if we have an API key
    const apiKey = ScraperClient.getApiKey();
    if (!apiKey) {
      toast.error("Please enter a valid Firecrawl API key");
      return { success: false };
    }

    try {
      // Start crawling
      setCrawlingUrl(urlType);
      setCrawlProgress(10);
      
      // Simulate progress while crawling
      const progressInterval = setInterval(() => {
        setCrawlProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 1000);
      
      // Determine the database URL type
      const dbUrlType = urlType === 'websiteUrl' ? 'website' : 'product';
      
      // Crawl the URL with more detailed response handling and pass the strategy ID
      console.log(`Starting crawl for ${urlType}: ${url} with strategy ID: ${formValues.id || 'none'}`);
      const result = await ScraperClient.scrapeWithApiKey(
        url, 
        apiKey, 
        {}, 
        formValues.id, 
        dbUrlType
      );
      
      console.log(`Crawl result for ${urlType}:`, result);
      
      // Stop the progress simulation
      clearInterval(progressInterval);
      
      if (!result.success) {
        const errorMessage = result.error || "Unknown error during scraping";
        console.error(`Crawl failed for ${urlType}:`, errorMessage);
        toast.error(`Failed to crawl: ${errorMessage}`);
        setCrawlProgress(0);
        setCrawlingUrl(null);
        return { success: false };
      }

      // Set the final progress
      setCrawlProgress(100);
      
      // Check if we have actual data in the response
      if (!result.data) {
        console.error(`Crawl succeeded but no data returned for ${urlType}`);
        toast.error("Crawl succeeded but no data was returned");
        setCrawlProgress(0);
        setCrawlingUrl(null);
        return { success: false };
      }
      
      // Prepare WebsiteCrawlResult from the raw result
      const crawlResult: WebsiteCrawlResult = {
        success: true,
        pagesCrawled: 1,
        contentExtracted: true,
        summary: "Website content extracted successfully",
        keywordsFound: [],
        technologiesDetected: [],
        data: [result.data],
        url: url,
        id: result.id,
        strategyId: formValues.id
      };
      
      // Set the preview results based on the URL type
      if (urlType === 'websiteUrl') {
        setWebsitePreviewResults(crawlResult);
      } else {
        setProductPreviewResults(crawlResult);
      }

      // Show a success message
      toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} crawled successfully`);
      
      // Reset the progress and crawling state
      setCrawlingUrl(null);
      setCrawlProgress(0);
      
      return { success: true };
    } catch (error) {
      console.error("Error crawling URL:", error);
      toast.error(`Error crawling URL: ${error instanceof Error ? error.message : String(error)}`);
      setCrawlingUrl(null);
      setCrawlProgress(0);
      return { success: false };
    }
  }, [formValues, setWebsitePreviewResults, setProductPreviewResults]);

  return {
    crawlingUrl,
    crawlProgress,
    handleCrawl
  };
};
