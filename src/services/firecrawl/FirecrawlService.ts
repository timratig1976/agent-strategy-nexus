
/**
 * Primary service for handling website crawling
 */

import { toast } from "sonner";
import { FirecrawlApiClient } from "./api-client";
import { processApiResponse } from "./content-processor";
import type { CrawlOptions, WebsiteCrawlResult } from "./types";

/**
 * Main service class for FireCrawl operations
 */
export class FirecrawlService {
  /**
   * Save API key to local storage
   */
  static saveApiKey(apiKey: string): void {
    FirecrawlApiClient.saveApiKey(apiKey);
  }

  /**
   * Get API key from local storage
   */
  static getApiKey(): string | null {
    return FirecrawlApiClient.getApiKey();
  }

  /**
   * Test the validity of an API key
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    return FirecrawlApiClient.testApiKey(apiKey);
  }

  /**
   * Crawl a website using the stored API key
   */
  static async crawlWebsite(url: string, options?: CrawlOptions): Promise<WebsiteCrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }

    return this.crawlWithApiKey(url, apiKey, options);
  }

  /**
   * Crawl a website with a specific API key
   */
  static async crawlWithApiKey(url: string, apiKey: string, options?: CrawlOptions): Promise<WebsiteCrawlResult> {
    try {
      // Make the API call using the API client
      const apiResponse = await FirecrawlApiClient.crawlWithApiKey(url, apiKey, options);
      
      // Process the API response
      return processApiResponse(apiResponse, url);
    } catch (error) {
      console.error("Error crawling website:", error);
      // Return the error directly instead of using a fallback
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred during crawl'}`,
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error occurred during crawl'
      };
    }
  }
}
