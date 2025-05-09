
/**
 * Scraper client for FireCrawl API
 * Handles communication with the FireCrawl API for website scraping
 */
import FirecrawlApp from "@mendable/firecrawl-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Type for supported formats in Firecrawl
 */
type FirecrawlFormat = "markdown" | "html" | "rawHtml" | "content" | "links" | 
                       "screenshot" | "screenshot@fullPage" | "json";

/**
 * Interface for scraping options
 */
interface ScrapeOptions {
  timeout?: number;
  formats?: FirecrawlFormat[];
}

/**
 * Structure for API success response
 */
interface ScrapeSuccessResponse {
  success: true;
  data: {
    markdown?: string;
    html?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
  id?: string;
}

/**
 * Structure for API error response
 */
interface ScrapeErrorResponse {
  success: false;
  error: string;
}

/**
 * Type guard for success response
 */
function isSuccessResponse(response: any): response is ScrapeSuccessResponse {
  return response && 
         response.success === true && 
         (response.data !== undefined || response.markdown !== undefined || response.html !== undefined);
}

/**
 * Type guard for error response
 */
function isErrorResponse(response: any): response is ScrapeErrorResponse {
  return response && response.success === false && typeof response.error === 'string';
}

/**
 * Our standardized response type for the application
 */
export interface ScrapeResponse {
  success: boolean;
  data?: {
    markdown: string;
    html: string;
    metadata: Record<string, any>;
  };
  error?: string;
  id?: string;
}

/**
 * ScraperClient handles website scraping operations via FireCrawl API
 */
export class ScraperClient {
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
   * Save crawl results to the database
   * @param url The URL that was scraped
   * @param strategyId The strategy ID
   * @param response The scrape response
   * @param urlType The type of URL (website or product)
   * @returns Promise that resolves when saved
   */
  private static async saveCrawlResult(
    url: string,
    strategyId: string | undefined,
    response: any,
    urlType: 'website' | 'product' = 'website'
  ): Promise<void> {
    if (!strategyId) {
      console.log("No strategy ID provided, skipping database save");
      return;
    }

    // Extract markdown and metadata
    const processedResponse = this.processResponse(response, url);
    if (!processedResponse.success || !processedResponse.data) {
      console.error("Cannot save invalid response to database");
      return;
    }

    try {
      console.log(`Saving ${urlType} crawl result for strategy ${strategyId}`);

      const data = {
        project_id: strategyId,
        url: url,
        status: 'completed',
        extracted_content: {
          data: [processedResponse.data],
          summary: "Website content extracted successfully",
          keywords: [],
          url_type: urlType
        }
      };

      // Save to the database
      const { error } = await supabase.from('website_crawls').insert(data);
      
      if (error) {
        console.error("Error saving crawl results:", error);
      } else {
        console.log(`${urlType} crawl result saved successfully`);
      }
    } catch (error) {
      console.error("Error in saveCrawlResult:", error);
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
      
      const processedResponse = this.processResponse(response, url);
      
      // If we have a strategy ID, save the results to the database
      if (strategyId && processedResponse.success) {
        await this.saveCrawlResult(url, strategyId, response, urlType);
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

  /**
   * Process the raw API response into our standardized format
   * 
   * @param response Raw response from the API
   * @param url The URL that was scraped (for error reporting)
   * @returns Standardized ScrapeResponse
   */
  private static processResponse(response: any, url: string): ScrapeResponse {
    // Handle string response (raw HTML)
    if (typeof response === 'string') {
      const content = response.trim();
      if (content.length > 0) {
        return {
          success: true,
          data: {
            markdown: "",  // No markdown in this case
            html: content,
            metadata: { sourceURL: url }
          }
        };
      }
      return {
        success: false,
        error: "API returned empty string response"
      };
    }

    // Handle array response (batch results)
    if (Array.isArray(response)) {
      // Extract markdown from all items
      const combinedMarkdown = response
        .filter(item => item && typeof item.markdown === 'string')
        .map(item => item.markdown)
        .join("\n\n---\n\n");
        
      // Get HTML from first item or empty string
      const firstHtml = response[0]?.html || "";
      
      // Get metadata from first item or create default
      const metadata = response[0]?.metadata || { sourceURL: url };
      
      return {
        success: true,
        data: {
          markdown: combinedMarkdown,
          html: firstHtml,
          metadata
        }
      };
    }
    
    // Handle well-formed success response
    if (isSuccessResponse(response)) {
      // Use the data object if it exists, otherwise use the response itself as data
      const responseData = response.data || response;
      
      return {
        success: true,
        data: {
          markdown: typeof responseData.markdown === 'string' ? responseData.markdown : "",
          html: typeof responseData.html === 'string' ? responseData.html : "",
          metadata: responseData.metadata || { sourceURL: url }
        },
        id: response.id
      };
    }
    
    // Handle error response
    if (isErrorResponse(response)) {
      return {
        success: false,
        error: response.error
      };
    }
    
    // Handle unexpected response format
    return {
      success: false,
      error: `Received unexpected response format from API: ${JSON.stringify(response)}`
    };
  }
}
