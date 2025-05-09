
/**
 * Client for FireCrawl API scraping operations
 */

import { SCRAPE_ENDPOINT, DEFAULT_FORMATS, DEFAULT_TIMEOUT } from './constants';
import { pollForScrapeResult } from './polling-client';

/**
 * ScraperClient handles direct interaction with the FireCrawl API
 */
export class ScraperClient {
  private static apiKey: string | null = null;

  /**
   * Set the API key to use for all scraping operations
   */
  static setApiKey(apiKey: string): void {
    ScraperClient.apiKey = apiKey;
  }

  /**
   * Clear the API key
   */
  static clearApiKey(): void {
    ScraperClient.apiKey = null;
  }

  /**
   * Scrape a website with the previously set API key
   */
  static async scrape(url: string, options?: { timeout?: number }): Promise<any> {
    if (!ScraperClient.apiKey) {
      throw new Error("API key not set. Please set an API key first.");
    }
    
    return ScraperClient.scrapeWithApiKey(url, ScraperClient.apiKey, options);
  }
  
  /**
   * Scrape a website with the provided API key
   */
  static async scrapeWithApiKey(url: string, apiKey: string, options?: { timeout?: number }): Promise<any> {
    try {
      console.log(`Starting scrape for URL: ${url}`);

      // Add http:// prefix if missing
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      
      const timeout = options?.timeout || DEFAULT_TIMEOUT;
      
      // Prepare the request body
      const requestBody = {
        url: url,
        formats: DEFAULT_FORMATS
      };
      
      console.log("Scrape request body:", requestBody);
      
      // Make the scrape request
      const response = await fetch(SCRAPE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("FireCrawl API error:", errorData);
        throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response
      const result = await response.json();
      console.log("FireCrawl API response:", result);
      
      // Handle both synchronous and asynchronous responses
      if (result.success && result.data) {
        // Synchronous response with immediate data
        return {
          success: true,
          data: result.data,
          url: url
        };
      } else if (result.success && result.id) {
        // Asynchronous response with job ID
        const resultUrl = result.url || `${SCRAPE_ENDPOINT}/${result.id}`;
        
        // Poll for the result
        return await pollForScrapeResult(result.id, apiKey, url, resultUrl);
      } else {
        throw new Error("Unexpected response format from FireCrawl API");
      }
    } catch (error) {
      console.error("Error scraping website:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        url: url
      };
    }
  }
}
