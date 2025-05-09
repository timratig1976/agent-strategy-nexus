
/**
 * Type definitions for FireCrawl scraper service
 */

/**
 * Type for supported formats in Firecrawl
 */
export type FirecrawlFormat = "markdown" | "html" | "rawHtml" | "content" | "links" | 
                             "screenshot" | "screenshot@fullPage" | "json";

/**
 * Interface for scraping options
 */
export interface ScrapeOptions {
  timeout?: number;
  formats?: FirecrawlFormat[];
}

/**
 * Structure for API success response
 */
export interface ScrapeSuccessResponse {
  success: true;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
  // Allow direct properties for backward compatibility
  markdown?: string;
  html?: string;
  metadata?: Record<string, any>;
  id?: string;
  [key: string]: any;
}

/**
 * Structure for API error response
 */
export interface ScrapeErrorResponse {
  success: false;
  error: string;
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
 * Type guard for success response
 */
export function isSuccessResponse(response: any): response is ScrapeSuccessResponse {
  return response && 
         response.success === true && 
         (response.data !== undefined || response.markdown !== undefined || response.html !== undefined);
}

/**
 * Type guard for error response
 */
export function isErrorResponse(response: any): response is ScrapeErrorResponse {
  return response && response.success === false && typeof response.error === 'string';
}
