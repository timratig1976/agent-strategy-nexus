/**
 * FireCrawl API service
 */

import { ScraperClient } from "./scraper-client";
import { ContentProcessor } from "./content-processor";
import { WebsiteCrawlResult } from "./types";
import { StorageClient } from "./storage-client";

/**
 * Main FireCrawl API service class that handles website crawling and data processing
 */
export class FirecrawlService {
  private static apiKey: string | null = null;

  /**
   * Initialize the FirecrawlService with an API key
   * @param apiKey The API key to use for the service
   */
  static initialize(apiKey: string) {
    FirecrawlService.apiKey = apiKey;
    ScraperClient.setApiKey(apiKey);
  }

  /**
   * Get the API key used by the FirecrawlService
   * @returns The API key or null if not initialized
   */
  static getApiKey(): string | null {
    return FirecrawlService.apiKey;
  }

  /**
   * Clear the API key used by the FirecrawlService
   */
  static clearApiKey() {
    FirecrawlService.apiKey = null;
    ScraperClient.clearApiKey();
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
      console.log("Starting website crawl for URL:", url);
      
      // Determine whether this is for a website or product URL
      const urlType = options.urlType === 'productUrl' ? 'product' : 'website';
      
      // Create an API client instance
      const apiClient = ScraperClient.getInstance();
      
      // Start the scraping operation
      const response = await apiClient.scrapeUrl(url, {
        formats: ["markdown"],
        // Add agent for better navigation
        agent: {
          model: "FIRE-1",
          prompt: `Extract the main content from this ${urlType} page including any important product or company information.`
        }
      });
      
      console.log("Scrape response received:", response);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to crawl website");
      }
      
      // Process the results and extract relevant info
      const processor = new ContentProcessor();
      const processedResults = processor.processScrapedData(response.data);
      
      // If we have a strategy ID, save the results to the database
      if (strategyId) {
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
    return StorageClient.getLatestCrawlResult(strategyId, urlType);
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
