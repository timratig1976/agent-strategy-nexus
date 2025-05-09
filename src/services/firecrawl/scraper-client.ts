
/**
 * Scraper client for FireCrawl API
 * Handles communication with the FireCrawl API for website scraping
 * This is a facade that coordinates the underlying modules
 */
import { ScraperApiClient } from "./api/scraper-api-client";
import { ScraperDbService } from "./db/scraper-db";
import { ScrapeOptions, ScrapeResponse } from "./types/scraper-types";

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
   * Save crawl results to the database (proxy method for backward compatibility)
   * @param url The URL that was scraped
   * @param strategyId The strategy ID
   * @param response The scrape response
   * @param urlType The type of URL (website or product)
   * @returns Promise that resolves when saved
   */
  static async saveCrawlResult(
    url: string,
    strategyId: string | undefined,
    response: any,
    urlType: 'website' | 'product' = 'website'
  ): Promise<void> {
    return ScraperDbService.saveCrawlResult(url, strategyId, response, urlType);
  }
}

// Re-export types for backward compatibility
export type { ScrapeOptions, ScrapeResponse } from "./types/scraper-types";
