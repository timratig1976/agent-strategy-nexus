
/**
 * Scraper client for FireCrawl API
 * Handles communication with the FireCrawl API for website scraping
 * This is a facade that coordinates the underlying modules
 */
import { ScraperApiClient } from "./api/scraper-api-client";
import { StorageService } from "./db/storage-service";
import { ScrapeOptions, ScrapeResponse } from "./types/scraper-types";
import { WebsiteCrawlResult } from "./types";

/**
 * ScraperClient handles website scraping operations via FireCrawl API
 * This is the main entry point for the scraper service
 */
export class ScraperClient {
  /**
   * Set the API key for the scraper
   * @param apiKey FireCrawl API key
   */
  static setApiKey(apiKey: string): void {
    ScraperApiClient.setApiKey(apiKey);
  }

  /**
   * Get the API key for the scraper
   * @returns The API key or null if not set
   */
  static getApiKey(): string | null {
    return ScraperApiClient.getApiKey();
  }

  /**
   * Clear the API key
   */
  static clearApiKey(): void {
    ScraperApiClient.clearApiKey();
  }

  /**
   * Scrape a URL using an explicitly provided API key
   * 
   * @param url URL to scrape
   * @param apiKey FireCrawl API key
   * @param options Optional parameters
   * @param strategyId Optional strategy ID to save results
   * @param urlType Type of URL (website or product)
   * @returns Standardized response with data or error
   */
  static async scrapeWithApiKey(
    url: string,
    apiKey: string,
    options: ScrapeOptions = {},
    strategyId?: string,
    urlType: 'website' | 'product' = 'website'
  ): Promise<ScrapeResponse> {
    return ScraperApiClient.scrapeWithApiKey(url, apiKey, options, strategyId, urlType);
  }

  /**
   * Save crawl results to the database
   * @param strategyId The strategy ID
   * @param results The crawl results to save
   * @param urlType The type of URL (website or product)
   * @returns Promise that resolves with success status
   */
  static async saveCrawlResults(
    strategyId: string, 
    results: WebsiteCrawlResult,
    urlType: 'website' | 'product' = 'website'
  ): Promise<boolean> {
    return StorageService.saveCrawlResults(strategyId, results, urlType);
  }
}

// Re-export types for backward compatibility
export type { ScrapeOptions, ScrapeResponse } from "./types/scraper-types";
