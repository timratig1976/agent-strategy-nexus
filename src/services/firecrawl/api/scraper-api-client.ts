
/**
 * API client for FireCrawl scraping operations
 */
import FirecrawlApp from "@mendable/firecrawl-js";
import { FirecrawlFormat, ScrapeOptions, ScrapeResponse } from "../types/scraper-types";
import { processApiResponse } from "../processors/response-processor";
import { ScraperDbService } from "../db/scraper-db";

/**
 * ScraperApiClient handles direct API communication with FireCrawl
 */
export class ScraperApiClient {
  private static apiKey: string | null = null;
  
  /**
   * Set the API key for the scraper
   * @param apiKey FireCrawl API key
   */
  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get the API key for the scraper
   * @returns The API key or null if not set
   */
  static getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Clear the API key
   */
  static clearApiKey(): void {
    this.apiKey = null;
  }

  /**
   * Execute a scrape operation using an explicitly provided API key
   * 
   * @param url URL to scrape
   * @param apiKey FireCrawl API key
   * @param options Optional parameters
   * @returns Raw response from the API
   */
  static async executeScrapingOperation(
    url: string,
    apiKey: string,
    options: ScrapeOptions = {}
  ): Promise<any> {
    try {
      console.log(`Executing scrape operation for URL: ${url} with options:`, options);
      
      // Create a FirecrawlApp instance with the provided API key
      const app = new FirecrawlApp({ apiKey });
      
      // Set default formats with proper type
      const formats: FirecrawlFormat[] = options.formats || ['markdown', 'html'];
      
      // Execute the scrape operation with timeout
      const response = await app.scrapeUrl(url, { 
        formats,
        timeout: options.timeout || 30000 // 30 seconds default timeout
      });
      
      console.log(`Raw scrape response for ${url}:`, response);
      return response;
      
    } catch (error) {
      console.error(`Error in scrape operation for URL ${url}:`, error);
      throw error;
    }
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
    try {
      console.log(`Scraping URL: ${url} with options:`, options);
      
      // Execute the scraping operation
      const response = await this.executeScrapingOperation(url, apiKey, options);
      
      // Process the response into our standardized format
      const processedResponse = processApiResponse(response, url);
      
      // If we have a strategy ID, save the results to the database
      if (strategyId && processedResponse.success) {
        await ScraperDbService.saveCrawlResult(url, strategyId, processedResponse, urlType);
      }
      
      return processedResponse;
    } catch (error) {
      console.error(`Error scraping URL ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during scraping"
      };
    }
  }
}
