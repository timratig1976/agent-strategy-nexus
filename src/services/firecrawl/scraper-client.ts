
/**
 * Scraper client for FireCrawl API
 */
import FirecrawlApp from "@mendable/firecrawl-js";
import { processApiResponse } from "./content-processor";

/**
 * Custom type for our application's scrape response
 */
export interface ScrapeResponse {
  success: boolean;
  data?: any;
  error?: string;
  id?: string;
}

/**
 * Type for supported formats in Firecrawl
 */
type FirecrawlFormat = "markdown" | "html" | "rawHtml" | "content" | "links" | 
                       "screenshot" | "screenshot@fullPage" | "extract" | "json" | "changeTracking";

/**
 * Interface for scraping options
 */
interface ScrapeOptions {
  timeout?: number;
  formats?: FirecrawlFormat[];
}

export class ScraperClient {
  private static apiKey: string | null = null;

  /**
   * Set the API key for the scraper
   * @param apiKey API key to use
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
   * Scrape a URL using an explicitly provided API key
   * 
   * @param url URL to scrape
   * @param apiKey FireCrawl API key
   * @param options Optional parameters
   * @returns Response from the API with additional processing
   */
  static async scrapeWithApiKey(
    url: string,
    apiKey: string,
    options: ScrapeOptions = {}
  ): Promise<ScrapeResponse> {
    try {
      console.log(`Scraping URL: ${url} with options:`, options);
      
      // Create a FirecrawlApp instance with the provided API key
      const app = new FirecrawlApp({ apiKey });
      
      // Set default formats with proper type
      const formats: FirecrawlFormat[] = options.formats || ['markdown', 'html'];
      
      // Execute the scrape operation with timeout
      const result = await app.scrapeUrl(url, { 
        formats,
        timeout: options.timeout || 30000 // 30 seconds default timeout
      });
      
      console.log(`Scrape response received for ${url}:`, {
        success: result.success,
        dataPresent: result.data ? 'Data present' : 'No data'
      });
      
      // Convert to our ScrapeResponse
      if (result.success && 'data' in result) {
        return {
          success: true,
          data: result.data,
          id: 'id' in result ? result.id : undefined
        };
      } else {
        return {
          success: false,
          error: 'error' in result ? result.error : "Unknown error during scraping"
        };
      }
    } catch (error) {
      console.error(`Error scraping URL ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during scraping"
      };
    }
  }
}
