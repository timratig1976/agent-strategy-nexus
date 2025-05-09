
/**
 * Processes responses from the FireCrawl API
 */
import { ScrapeSuccessResponse, ScrapeResponse, isSuccessResponse, isErrorResponse } from "../types/scraper-types";

/**
 * Process the raw API response into our standardized format
 * 
 * @param response Raw response from the API
 * @param url The URL that was scraped (for error reporting)
 * @returns Standardized ScrapeResponse
 */
export function processApiResponse(response: any, url: string): ScrapeResponse {
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
    // Extract data safely with proper type checking
    const dataSource = response as ScrapeSuccessResponse;
    
    // Get markdown from either the data object or direct property
    const markdown = 
      (dataSource.data && typeof dataSource.data.markdown === 'string') ? dataSource.data.markdown : 
      (typeof dataSource.markdown === 'string' ? dataSource.markdown : "");
    
    // Get HTML from either the data object or direct property
    const html = 
      (dataSource.data && typeof dataSource.data.html === 'string') ? dataSource.data.html : 
      (typeof dataSource.html === 'string' ? dataSource.html : "");
    
    // Get metadata from either the data object or direct property or create default
    const metadata = 
      (dataSource.data && dataSource.data.metadata) ? dataSource.data.metadata : 
      (dataSource.metadata || { sourceURL: url });
    
    return {
      success: true,
      data: {
        markdown,
        html,
        metadata
      },
      id: dataSource.id
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
