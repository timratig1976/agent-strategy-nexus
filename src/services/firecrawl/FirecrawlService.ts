
/**
 * FireCrawl API service
 */

import { ScraperClient } from "./scraper-client";
import { ContentProcessor, processApiResponse } from "./content-processor";
import { WebsiteCrawlResult } from "./types";
import { StorageClient } from "./storage-client";
import { FirecrawlAuthManager } from "./auth-manager";

/**
 * Main FireCrawl API service class that handles website crawling and data processing
 */
export class FirecrawlService {
  private static apiKey: string | null = null;
  private static contentProcessor = new ContentProcessor();

  /**
   * Initialize the FirecrawlService with an API key
   * @param apiKey The API key to use for the service
   */
  static initialize(apiKey: string) {
    console.log("Initializing FirecrawlService with API key");
    FirecrawlService.apiKey = apiKey;
    ScraperClient.setApiKey(apiKey);
  }

  /**
   * Get the API key used by the FirecrawlService
   * @returns The API key or null if not initialized
   */
  static getApiKey(): string | null {
    const storedKey = FirecrawlAuthManager.getApiKey();
    if (storedKey && !FirecrawlService.apiKey) {
      // Initialize if we have a stored key but service isn't initialized
      FirecrawlService.initialize(storedKey);
    }
    return storedKey || FirecrawlService.apiKey;
  }

  /**
   * Clear the API key used by the FirecrawlService
   */
  static clearApiKey() {
    console.log("Clearing FirecrawlService API key");
    FirecrawlService.apiKey = null;
    ScraperClient.clearApiKey();
    FirecrawlAuthManager.clearApiKey();
  }

  /**
   * Check if an API key has valid format (only validates format, not actual API access)
   * @param apiKey The API key to test
   * @returns Boolean indicating if the key format is valid
   */
  static testApiKey(apiKey: string): boolean {
    return FirecrawlAuthManager.validateApiKeyFormat(apiKey);
  }

  /**
   * Save an API key to localStorage
   * @param apiKey The API key to save
   */
  static saveApiKey(apiKey: string): void {
    console.log("Saving API key to FirecrawlService and localStorage");
    FirecrawlAuthManager.saveApiKey(apiKey);
    FirecrawlService.initialize(apiKey);
  }

  /**
   * Crawl a website and extract its content
   * 
   * @param url The URL of the website to crawl
   * @param options Optional parameters for the crawler
   * @param strategyId Optional ID of the strategy to save results to
   * @returns WebsiteCrawlResult object with the extracted data or an error
   */
  static async crawlWebsite(
    url: string, 
    options: { timeout?: number; urlType?: 'websiteUrl' | 'productUrl' } = {}, 
    strategyId?: string
  ): Promise<WebsiteCrawlResult> {
    try {
      console.log(`Starting website crawl for URL: ${url}, with strategyId: ${strategyId || 'none'}`);
      
      // Determine whether this is for a website or product URL
      const urlType = options.urlType === 'productUrl' ? 'product' : 'website';
      console.log(`URL type: ${urlType}`);
      
      // Get the API key
      const apiKey = FirecrawlService.getApiKey();
      if (!apiKey) {
        throw new Error("API key not set. Please initialize FirecrawlService first.");
      }
      
      // Start the scraping operation
      const response = await ScraperClient.scrapeWithApiKey(url, apiKey, {
        timeout: options.timeout
      });
      
      console.log("Scrape response received:", response);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to crawl website");
      }
      
      // Process the results and extract relevant info
      const processedResults = this.contentProcessor.processScrapedData(response);
      
      // If we have a strategy ID, save the results to the database
      if (strategyId) {
        console.log(`Saving crawl results to database for strategy: ${strategyId}, url type: ${urlType}`);
        await StorageClient.saveCrawlResults(strategyId, processedResults, urlType as 'website' | 'product');
      }
      
      return processedResults;
    } catch (error) {
      console.error("Error crawling website:", error);
      
      // Return a structured error object
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: [],
        pagesCrawled: 0,
        contentExtracted: false,
        summary: "Failed to crawl website. Please check the URL and try again.",
        keywordsFound: [],
        technologiesDetected: [],
        url: url
      };
    }
  }
  
  /**
   * Get the latest crawl result for a strategy from the database
   * @param strategyId The ID of the strategy
   * @param urlType Specifies if this is a website or product URL
   * @returns The latest crawl result or null if none found
   */
  static async getLatestCrawlResult(
    strategyId: string,
    urlType: 'website' | 'product' = 'website'
  ): Promise<WebsiteCrawlResult | null> {
    console.log(`Getting latest crawl result for strategy: ${strategyId}, url type: ${urlType}`);
    const result = await StorageClient.getLatestCrawlResult(strategyId, urlType);
    console.log(`Retrieved latest ${urlType} result:`, result ? "found" : "not found");
    return result;
  }

  /**
   * Get all crawl results for a strategy from the database
   * @param strategyId The ID of the strategy
   * @param urlType Specifies if this is a website or product URL
   * @returns Array of crawl results or empty array if none found
   */
  static async getAllCrawlResults(
    strategyId: string,
    urlType: 'website' | 'product' = 'website'
  ): Promise<WebsiteCrawlResult[]> {
    return StorageClient.getAllCrawlResults(strategyId, urlType);
  }
}
