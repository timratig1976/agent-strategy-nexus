
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult, FirecrawlService } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";

export type CrawlUrlType = 'websiteUrl' | 'productUrl';

export function useCrawlUrl(formValues: StrategyFormValues & { id?: string }) {
  const [crawlingUrl, setCrawlingUrl] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());
  const [crawlStatus, setCrawlStatus] = useState<string>(""); // Track the crawl status

  // Check for API key and update state
  const checkApiKey = () => {
    const apiKey = FirecrawlService.getApiKey();
    setHasApiKey(!!apiKey);
    return !!apiKey;
  };

  const handleCrawl = async (urlType: CrawlUrlType) => {
    const url = formValues[urlType];
    
    if (!url) {
      toast.error("Please enter a URL to crawl");
      return { success: false };
    }

    if (!/^https?:\/\//i.test(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return { success: false };
    }

    // Check for API key
    if (!checkApiKey()) {
      toast.error("Please set your FireCrawl API key first");
      return { success: false };
    }

    setCrawlingUrl(urlType);
    setCrawlProgress(10);
    setCrawlStatus("initializing");
    
    if (urlType === 'websiteUrl') {
      setShowWebsitePreview(false);
      setWebsitePreviewResults(null);
    } else {
      setShowProductPreview(false);
      setProductPreviewResults(null);
    }
    
    try {
      toast.info(`Crawling ${urlType === 'websiteUrl' ? 'website' : 'product'} URL...`);
      
      // More realistic progress simulation with status updates
      let progressValue = 10;
      const progressInterval = setInterval(() => {
        // Update status message based on progress
        if (progressValue <= 20) {
          setCrawlStatus("initializing");
        } else if (progressValue <= 40) {
          setCrawlStatus("scraping");
        } else if (progressValue <= 60) {
          setCrawlStatus("processing");
        } else if (progressValue <= 90) {
          setCrawlStatus("analyzing");
        }
        
        // Increment progress, but slow down as we get higher
        setCrawlProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 80) return prev + 1;
          return prev;
        });
        
        progressValue += 5;
        if (progressValue >= 90) {
          clearInterval(progressInterval);
        }
      }, 1500);
      
      // Direct API call to FireCrawl instead of using Edge Function
      const crawlResult = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      setCrawlProgress(100);
      setCrawlStatus("completed");
      
      if (crawlResult) {
        console.log(`${urlType} crawl results:`, crawlResult);
        
        // Set the appropriate preview results based on URL type
        if (urlType === 'websiteUrl') {
          setWebsitePreviewResults(crawlResult);
        } else {
          setProductPreviewResults(crawlResult);
        }
        
        // Save crawl results to the database but don't modify additional info
        // Don't auto-fill form fields with content from crawled sites
        const { error: saveError } = await supabase.rpc(
          'upsert_strategy_metadata',
          {
            strategy_id_param: formValues.id,
            company_name_param: formValues.companyName || "", // Keep original values
            website_url_param: urlType === 'websiteUrl' ? url : formValues.websiteUrl || "",
            product_description_param: formValues.productDescription || "", // Keep original values
            product_url_param: urlType === 'productUrl' ? url : formValues.productUrl || "",
            additional_info_param: formValues.additionalInfo || ""
          }
        );
        
        if (saveError) {
          console.error("Error saving crawl results:", saveError);
          toast.error("Failed to save crawl results");
        } else {
          toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} URL crawled successfully`);
          
          // Show the appropriate preview
          if (urlType === 'websiteUrl') {
            setShowWebsitePreview(true);
          } else {
            setShowProductPreview(true);
          }

          return {
            success: true,
            data: crawlResult,
            urlType
          };
        }
      }
    } catch (err: any) {
      console.error(`Error crawling ${urlType}:`, err);
      toast.error(err.message || `Failed to crawl ${urlType === 'websiteUrl' ? 'website' : 'product'} URL`);
      setCrawlStatus("failed");
    } finally {
      setCrawlingUrl(null);
      setCrawlProgress(100);
    }
    
    return { success: false };
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
    checkApiKey,
    crawlStatus // Add the crawl status to the return value
  };
}
