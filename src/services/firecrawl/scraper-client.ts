
/**
 * Scraper client for FireCrawl API scraping operations
 */

import { SCRAPE_ENDPOINT, DEFAULT_FORMATS, DEFAULT_TIMEOUT } from './constants';
import { processScrapedData } from './response-processor';
import { pollForScrapeResult } from './polling-client';

/**
 * Handles the scraping operations with the FireCrawl API
 */
export class ScraperClient {
  /**
   * Scrape a website with the specified API key
   */
  static async scrapeWithApiKey(url: string, apiKey: string, options?: { timeout?: number }): Promise<any> {
    try {
      console.log('Making scrape request to Firecrawl API for URL:', url);
      
      const requestBody = {
        url: url,
        formats: DEFAULT_FORMATS,
        timeout: options?.timeout || DEFAULT_TIMEOUT
      };
      
      console.log("Request body:", requestBody);
      
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
        // Handle API errors
        const errorData = await response.json();
        console.error("FireCrawl API error:", errorData);
        
        return {
          success: false,
          pagesCrawled: 0,
          contentExtracted: false,
          summary: `Error: ${errorData.message || response.statusText}`,
          keywordsFound: [],
          technologiesDetected: [],
          data: [],
          url: url,
          error: errorData.message || `API returned ${response.status}: ${response.statusText}`
        };
      }
      
      // Parse the response - scrape endpoints typically return data directly
      const scrapeResult = await response.json();
      console.log("FireCrawl scrape response:", scrapeResult);
      
      // For most scrapes, the data is returned immediately
      if (scrapeResult.success && scrapeResult.data) {
        console.log("Scrape completed successfully with direct data");
        return processScrapedData(scrapeResult, url);
      }
      
      // For larger or more complex scrapes that return a job ID, implement polling
      if (scrapeResult.id) {
        console.log("Scrape request returned a job ID for polling:", scrapeResult.id);
        const resultUrl = `${SCRAPE_ENDPOINT}/${scrapeResult.id}`;
        return await pollForScrapeResult(scrapeResult.id, apiKey, url, resultUrl);
      }
      
      // Unexpected response format
      console.error("Unexpected scrape result format:", scrapeResult);
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: "Unexpected response format from Firecrawl API",
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: "Unexpected response format from Firecrawl API"
      };
      
    } catch (error) {
      console.error("Error in API client scrape:", error);
      throw error;
    }
  }
}
