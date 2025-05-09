
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { FirecrawlService } from "@/services/firecrawl";
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
    const apiKey = FirecrawlService.getApiKey();
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
      
      // Perform the crawl with FirecrawlService, passing strategy ID for database storage
      console.log(`Starting crawl for ${urlType}: ${url} with strategy ID: ${formValues.id || 'none'}`);
      
      const crawlResult = await FirecrawlService.crawlWebsite(
        url, 
        { urlType }, 
        formValues.id
      );
      
      console.log(`Crawl result for ${urlType}:`, crawlResult);
      
      // Stop the progress simulation
      clearInterval(progressInterval);
      
      if (!crawlResult.success) {
        const errorMessage = crawlResult.error || "Unknown error during crawling";
        console.error(`Crawl failed for ${urlType}:`, errorMessage);
        toast.error(`Failed to crawl: ${errorMessage}`);
        setCrawlProgress(0);
        setCrawlingUrl(null);
        return { success: false };
      }

      // Set the final progress
      setCrawlProgress(100);
      
      // Set the preview results based on the URL type
      if (urlType === 'websiteUrl') {
        setWebsitePreviewResults(crawlResult);
      } else {
        setProductPreviewResults(crawlResult);
      }

      // Show a success message
      toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} crawled successfully`);
      
      // Reset the progress and crawling state
      setTimeout(() => {
        setCrawlingUrl(null);
        setCrawlProgress(0);
      }, 1000);
      
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
