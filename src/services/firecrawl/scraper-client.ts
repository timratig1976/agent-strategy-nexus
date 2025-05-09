
/**
 * Scraper client for FireCrawl API
 * Handles the communication with FireCrawl API for website scraping
 */
import FirecrawlApp from "@mendable/firecrawl-js";

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
 * Structure for the API response when successful
 */
interface ScrapeSuccessResponse {
  success: true;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
  id?: string;
}

/**
 * Structure for the API response when failed
 */
interface ScrapeErrorResponse {
  success: false;
  error: string;
}

/**
 * Union type for all possible API responses
 */
type FirecrawlApiResponse = ScrapeSuccessResponse | ScrapeErrorResponse | string;

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
   * Scrape a URL using an explicitly provided API key
   * 
   * @param url URL to scrape
   * @param apiKey FireCrawl API key
   * @param options Optional parameters
   * @returns Standardized response with data or error
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
      
      return this.processResponse(response, url);
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

    // Handle explicit error response
    if (response && !response.success && response.error) {
      return {
        success: false,
        error: response.error
      };
    }

    // Handle successful response with data property
    if (response && response.success && response.data) {
      // Extract the data from the success response
      const { markdown = "", html = "", metadata = {} } = response.data;
      
      return {
        success: true,
        data: {
          markdown: typeof markdown === 'string' ? markdown : "",
          html: typeof html === 'string' ? html : "",
          metadata: metadata || { sourceURL: url }
        },
        id: response.id
      };
    }
    
    // Handle success response with direct properties (not nested under data)
    if (response && response.success && (response.markdown || response.html)) {
      return {
        success: true,
        data: {
          markdown: typeof response.markdown === 'string' ? response.markdown : "",
          html: typeof response.html === 'string' ? response.html : "",
          metadata: response.metadata || { sourceURL: url }
        },
        id: response.id
      };
    }
    
    // Handle array responses (page data from batch operations)
    if (response && Array.isArray(response)) {
      // Combine markdown from all pages
      const combinedMarkdown = response
        .filter(item => item && item.markdown)
        .map(item => item.markdown)
        .join("\n\n---\n\n");
      
      // Get the first page's HTML for preview
      const firstHtml = response[0]?.html || "";
      
      // Collect metadata from the first page
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
    
    // Last attempt to extract useful data from an unexpected format
    if (response && typeof response === 'object') {
      const extractedData = {
        markdown: "",
        html: "",
        metadata: { sourceURL: url }
      };
      
      // Try to find markdown content
      if ('markdown' in response) {
        extractedData.markdown = typeof response.markdown === 'string' ? response.markdown : "";
      }
      
      // Try to find HTML content
      if ('html' in response) {
        extractedData.html = typeof response.html === 'string' ? response.html : "";
      }
      
      // Try to find metadata
      if ('metadata' in response) {
        extractedData.metadata = response.metadata || { sourceURL: url };
      }
      
      // If we found any content, consider it a success
      if (extractedData.markdown || extractedData.html) {
        return {
          success: true,
          data: extractedData,
          id: response.id
        };
      }
    }
    
    // Fallback for any other unexpected response format
    return {
      success: false,
      error: `Received unexpected response format from API: ${typeof response}`
    };
  }
}
