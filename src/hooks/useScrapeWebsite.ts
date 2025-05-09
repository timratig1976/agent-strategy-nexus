
import { useState, useCallback } from 'react';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

interface UseScrapeWebsiteOptions {
  apiKey?: string;
  formats?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface ScrapeResult {
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    keywords?: string;
    sourceURL?: string;
    [key: string]: any;
  };
  json?: any;
}

// Define types for successful and error responses separately
type CustomSuccessResponse = {
  success: true;
  data: {
    markdown?: string;
    html?: string;
    metadata?: any;
    json?: any;
  };
};

type CustomErrorResponse = {
  success: false;
  error: string;
};

// Combined type that can be either success or error
type CustomScrapeResponse = CustomSuccessResponse | CustomErrorResponse;

export const useScrapeWebsite = (options: UseScrapeWebsiteOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const scrapeUrl = useCallback(async (url: string, customOptions?: any) => {
    if (!url) {
      setError(new Error('URL is required'));
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create a Firecrawl instance with the API key
      const apiKey = options.apiKey || process.env.FIRECRAWL_API_KEY;
      if (!apiKey) {
        throw new Error('Firecrawl API key is required');
      }

      const app = new FirecrawlApp({ apiKey });

      // Configure scrape options
      const scrapeOptions = {
        formats: customOptions?.formats || options.formats || ['markdown', 'html'],
        ...customOptions
      };

      // Scrape the URL
      const scrapeResult = await app.scrapeUrl(url, scrapeOptions) as CustomScrapeResponse;

      if (!scrapeResult.success) {
        // Type guard ensures TypeScript knows this is CustomErrorResponse
        throw new Error(`Failed to scrape: ${scrapeResult.error}`);
      }

      // At this point TypeScript knows scrapeResult is CustomSuccessResponse
      // Extract the data from the result
      const resultData = {
        markdown: scrapeResult.data?.markdown,
        html: scrapeResult.data?.html,
        metadata: scrapeResult.data?.metadata,
        json: scrapeResult.data?.json
      };

      setResult(resultData);

      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess(resultData);
      }

      return resultData;
    } catch (e: any) {
      const errorObj = new Error(e.message || 'Failed to scrape website');
      setError(errorObj);
      
      // Call the error callback if provided
      if (options.onError) {
        options.onError(errorObj);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    scrapeUrl,
    isLoading,
    error,
    result,
    reset: () => {
      setResult(null);
      setError(null);
    }
  };
};
