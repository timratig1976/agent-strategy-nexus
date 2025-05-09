
import { useState, useCallback, useEffect } from "react";
import { ScraperClient } from "@/services/firecrawl/scraper-client";

/**
 * Hook to handle API key validation and checking
 */
export const useCrawlApiKey = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  // Check if we have an API key on mount
  useEffect(() => {
    checkApiKey();
  }, []);

  // Check if we have a valid API key
  const checkApiKey = useCallback(() => {
    const apiKey = ScraperClient.getApiKey();
    console.log("API key check result:", !!apiKey);
    setHasApiKey(!!apiKey);
    return !!apiKey;
  }, []);

  return {
    hasApiKey,
    checkApiKey
  };
};
