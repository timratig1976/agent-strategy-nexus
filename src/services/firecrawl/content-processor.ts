
/**
 * Content processing utilities for FireCrawl results
 */

import { WebsiteCrawlResult } from "./types";
import { 
  extractCommonWords, 
  extractKeywords, 
  extractSummary 
} from "./utils/text-extraction";
import { detectTechnologies } from "./utils/tech-detector";

/**
 * Content Processor class for handling FireCrawl result processing
 */
export class ContentProcessor {
  /**
   * Process scraped data into a structured format
   */
  processScrapedData(apiResponse: any): WebsiteCrawlResult {
    // Check if we have valid content in the response
    const hasData = apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0;
    
    // Process the data regardless of content "quality"
    const processedData: WebsiteCrawlResult = {
      success: true,
      pagesCrawled: apiResponse.data?.length || 0,
      contentExtracted: hasData, // Only true if we actually have data
      summary: hasData ? extractSummary(apiResponse.data) : "No content was extracted from the website.",
      keywordsFound: hasData ? extractKeywords(apiResponse.data) : [],
      technologiesDetected: hasData ? detectTechnologies(apiResponse.data) : [],
      data: apiResponse.data || [],
      id: apiResponse.id || null,
      url: apiResponse.url || "",
      status: apiResponse.status || 'completed'
    };
    
    return processedData;
  }
}

/**
 * Process API response data into a structured format
 */
export function processApiResponse(apiResponse: any, url: string): WebsiteCrawlResult {
  // Check if we have valid content in the response
  const hasData = apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0;
  
  // Process the data regardless of content "quality"
  const processedData: WebsiteCrawlResult = {
    success: true,
    pagesCrawled: apiResponse.data?.length || 0,
    contentExtracted: hasData, // Only true if we actually have data
    summary: hasData ? extractSummary(apiResponse.data) : "No content was extracted from the website.",
    keywordsFound: hasData ? extractKeywords(apiResponse.data) : [],
    technologiesDetected: hasData ? detectTechnologies(apiResponse.data) : [],
    data: apiResponse.data || [],
    id: apiResponse.id || null,
    url: url,
    status: apiResponse.status || 'completed'
  };
  
  return processedData;
}

// Export all utility functions for direct use
export {
  extractCommonWords,
  extractKeywords,
  extractSummary,
  detectTechnologies
};
