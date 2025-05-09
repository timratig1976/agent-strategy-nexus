
/**
 * Scraper client for FireCrawl API
 */
import FirecrawlApp from "@mendable/firecrawl-js";
import { processApiResponse } from "./content-processor";

/**
 * Define types for the FirecrawlApp responses to properly handle them
 */
interface ErrorResponse {
  success: false;
  error: string;
}

interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  markdown?: string;
  html?: string;
  metadata?: any;
  id?: string;
}

type FirecrawlResponse = ErrorResponse | SuccessResponse;

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
      const response = await app.scrapeUrl(url, { 
        formats,
        timeout: options.timeout || 30000 // 30 seconds default timeout
      });
      
      console.log(`Raw scrape response for ${url}:`, response);
      
      // Type guard function to check if response is an ErrorResponse
      function isErrorResponse(resp: unknown): resp is ErrorResponse {
        return resp !== null && 
               typeof resp === 'object' && 
               'success' in resp && 
               (resp as any).success === false;
      }
      
      // Type guard function to check if response is a SuccessResponse
      function isSuccessResponse(resp: unknown): resp is SuccessResponse {
        return resp !== null && 
               typeof resp === 'object' && 
               'success' in resp && 
               (resp as any).success === true;
      }
      
      // Handle string response (raw HTML)
      if (typeof response === 'string') {
        const stringResponse = response;
        if (stringResponse && stringResponse.trim().length > 0) {
          return {
            success: true,
            data: {
              html: stringResponse, 
              markdown: ""
            }
          };
        }
      }
      
      // Handle error response
      if (isErrorResponse(response)) {
        return {
          success: false,
          error: response.error || "API reported failure"
        };
      }
      
      // Handle success response but extract direct properties if data is missing
      if (isSuccessResponse(response)) {
        // If we have data, use it directly
        if (response.data) {
          return {
            success: true,
            data: response.data,
            id: response.id
          };
        }
        
        // If data is missing but we have direct markdown/html/metadata properties, construct a data object
        if (response.markdown || response.html || response.metadata) {
          const constructedData = {
            markdown: response.markdown || "",
            html: response.html || "",
            metadata: response.metadata || {}
          };
          
          return {
            success: true,
            data: constructedData,
            id: response.id
          };
        }
        
        // Return empty data structure if nothing useful found
        return {
          success: true,
          data: { markdown: "", html: "", metadata: {} },
          id: response.id
        };
      }
      
      // Handle unexpected object response by checking for common properties
      if (response && typeof response === 'object') {
        // Try to extract any useful data
        const extractedData: any = {};
        
        if ('markdown' in response) extractedData.markdown = (response as any).markdown || "";
        if ('html' in response) extractedData.html = (response as any).html || "";
        if ('metadata' in response) extractedData.metadata = (response as any).metadata || {};
        
        if (Object.keys(extractedData).length > 0) {
          return {
            success: true,
            data: extractedData,
            id: 'id' in response ? (response as any).id : undefined
          };
        }
        
        // If it looks like data itself (no error or success props)
        if (!('error' in response) && !('success' in response)) {
          return {
            success: true,
            data: response
          };
        }
      }
      
      // Fallback for truly unexpected formats
      return {
        success: false,
        error: "Received unexpected response format from API"
      };
    } catch (error) {
      console.error(`Error scraping URL ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during scraping"
      };
    }
  }
}
