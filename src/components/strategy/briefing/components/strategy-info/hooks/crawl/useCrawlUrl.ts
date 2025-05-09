
import { useEffect } from "react";
import { StrategyFormValues } from "@/components/strategy-form";
import { CrawlUrlState } from "./types";
import { useCrawlApiKey } from "./useCrawlApiKey";
import { useSavedCrawlResults } from "./useSavedCrawlResults";
import { useCrawlHandler } from "./useCrawlHandler";
import { usePreviewState } from "./usePreviewState";

/**
 * Main hook for URL crawling functionality
 * This combines the more focused hooks into one unified API
 */
export const useCrawlUrl = (formValues: StrategyFormValues & { id?: string }): CrawlUrlState => {
  // Use focused hooks
  const { hasApiKey, checkApiKey } = useCrawlApiKey();
  
  const { 
    websitePreviewResults, 
    productPreviewResults, 
    setWebsitePreviewResults,
    setProductPreviewResults,
    loadSavedCrawlResults 
  } = useSavedCrawlResults();
  
  const {
    showWebsitePreview,
    showProductPreview,
    setShowWebsitePreview,
    setShowProductPreview
  } = usePreviewState();
  
  const { 
    crawlingUrl, 
    crawlProgress, 
    handleCrawl 
  } = useCrawlHandler(
    formValues, 
    setWebsitePreviewResults, 
    setProductPreviewResults
  );

  // Load saved crawl results if we have a strategy ID
  useEffect(() => {
    if (formValues.id) {
      console.log("Strategy ID detected:", formValues.id, "loading saved crawl data");
      loadSavedCrawlResults(formValues.id);
    }
  }, [formValues.id, loadSavedCrawlResults]);

  // Combine all the hook results into a single object
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
