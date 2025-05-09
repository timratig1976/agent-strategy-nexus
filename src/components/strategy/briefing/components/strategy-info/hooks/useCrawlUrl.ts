
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScraperClient } from "@/services/firecrawl/scraper-client";
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";

export const useCrawlUrl = (formValues: StrategyFormValues & { id?: string }) => {
  const [crawlingUrl, setCrawlingUrl] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState<number>(0);
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [showWebsitePreview, setShowWebsitePreview] = useState<boolean>(false);
  const [showProductPreview, setShowProductPreview] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check if we have an API key on mount
  useEffect(() => {
    checkApiKey();
    
    // Load saved crawl results if we have a strategy ID
    if (formValues.id) {
      console.log("Strategy ID detected:", formValues.id, "loading saved crawl data");
      loadSavedCrawlResults(formValues.id);
    }
  }, [formValues.id]);

  // Check if we have a valid API key
  const checkApiKey = () => {
    const apiKey = ScraperClient.getApiKey();
    console.log("API key check result:", !!apiKey);
    setHasApiKey(!!apiKey);
    return !!apiKey;
  };
  
  // Load saved crawl results for the current strategy
  const loadSavedCrawlResults = async (strategyId: string) => {
    try {
      console.log("Loading saved crawl results for strategy:", strategyId);
      
      // Query the website_crawls table for the website URL crawl
      const { data: websiteData, error: websiteError } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('project_id', strategyId)
        .eq('extracted_content->url_type', 'website')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (websiteError) {
        console.error("Error loading website crawl results:", websiteError);
      } else if (websiteData && websiteData.length > 0) {
        console.log("Found saved website crawl result:", websiteData[0]);
        // Convert from DB format to WebsiteCrawlResult
        const websiteResult: WebsiteCrawlResult = {
          success: true,
          pagesCrawled: 1,
          contentExtracted: true,
          summary: websiteData[0].extracted_content?.summary || "",
          keywordsFound: websiteData[0].extracted_content?.keywords || [],
          technologiesDetected: [],
          data: websiteData[0].extracted_content?.data || [],
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
        .eq('extracted_content->url_type', 'product')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (productError) {
        console.error("Error loading product crawl results:", productError);
      } else if (productData && productData.length > 0) {
        console.log("Found saved product crawl result:", productData[0]);
        // Convert from DB format to WebsiteCrawlResult
        const productResult: WebsiteCrawlResult = {
          success: true,
          pagesCrawled: 1,
          contentExtracted: true,
          summary: productData[0].extracted_content?.summary || "",
          keywordsFound: productData[0].extracted_content?.keywords || [],
          technologiesDetected: [],
          data: productData[0].extracted_content?.data || [],
          url: productData[0].url,
          id: productData[0].id,
          strategyId
        };
        setProductPreviewResults(productResult);
      }
    } catch (error) {
      console.error("Error loading saved crawl results:", error);
    }
  };

  // Handle crawling a URL
  const handleCrawl = async (urlType: 'websiteUrl' | 'productUrl'): Promise<{ success: boolean }> => {
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
      
      // Crawl the URL
      const result = await ScraperClient.scrapeWithApiKey(url, apiKey);
      
      // Stop the progress simulation
      clearInterval(progressInterval);
      
      if (!result.success) {
        console.error("Crawl failed:", result.error);
        toast.error(`Failed to crawl: ${result.error || "Unknown error"}`);
        setCrawlProgress(0);
        setCrawlingUrl(null);
        return { success: false };
      }

      // Set the final progress
      setCrawlProgress(100);
      
      // Prepare WebsiteCrawlResult from the raw result
      const crawlResult: WebsiteCrawlResult = {
        success: true,
        pagesCrawled: 1,
        contentExtracted: true,
        summary: "Website content extracted successfully",
        keywordsFound: [],
        technologiesDetected: [],
        data: result.data ? [result.data] : [],
        url: url,
        id: result.id || undefined,
        strategyId: formValues.id
      };
      
      // Set the preview results based on the URL type
      if (urlType === 'websiteUrl') {
        setWebsitePreviewResults(crawlResult);
      } else {
        setProductPreviewResults(crawlResult);
      }
      
      // Save the results to the database
      if (formValues.id) {
        await saveCrawlResults(formValues.id, urlType, url, result);
      }

      // Show a success message
      toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} crawled successfully`);
      
      // Reset the progress and crawling state
      setCrawlingUrl(null);
      setCrawlProgress(0);
      
      return { success: true };
    } catch (error) {
      console.error("Error crawling URL:", error);
      toast.error(`Error crawling URL: ${error}`);
      setCrawlingUrl(null);
      setCrawlProgress(0);
      return { success: false };
    }
  };

  // Save crawl results to the database
  const saveCrawlResults = async (strategyId: string, urlType: string, url: string, result: any) => {
    try {
      console.log(`Saving ${urlType} crawl results for strategy ${strategyId}`);
      
      // Prepare the data to save in the website_crawls table
      const data = {
        project_id: strategyId,
        url: url,
        status: 'completed',
        extracted_content: {
          data: result.data ? [result.data] : [],
          summary: "Website content extracted successfully",
          keywords: [],
          url_type: urlType === 'websiteUrl' ? 'website' : 'product'
        }
      };
      
      // Save to the database
      const { error } = await supabase.from('website_crawls').insert(data);
      
      if (error) {
        console.error("Error saving crawl results:", error);
        throw error;
      }
      
      console.log(`${urlType} crawl results saved successfully`);
    } catch (error) {
      console.error("Error saving crawl results:", error);
      throw error;
    }
  };

  return {
    crawlingUrl,
    crawlProgress,
    websitePreviewResults,
    productPreviewResults,
    showWebsitePreview,
    showProductPreview,
    setShowWebsitePreview,
    setShowProductPreview,
    handleCrawl,
    hasApiKey,
    checkApiKey
  };
};
