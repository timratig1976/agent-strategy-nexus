
/**
 * API client for FireCrawl API interactions
 */

import { toast } from "sonner";

const API_KEY_STORAGE_KEY = 'firecrawl_api_key';

/**
 * Handles API interactions with FireCrawl
 */
export class FirecrawlApiClient {
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    console.log('FireCrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      // A simple test request to verify the API key
      const testResponse = await this.crawlWithApiKey('https://example.com', apiKey);
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWithApiKey(url: string, apiKey: string, options?: { timeout?: number }): Promise<any> {
    try {
      console.log('Making initial scrape request to Firecrawl API for URL:', url);
      
      // Updated request body format based on API error
      const requestBody = {
        url: url,
        // Removed "limit" and "scrapeOptions" keys that were causing errors
        // Only including format here, as it's likely still needed
        format: 'markdown',
        timeout: options?.timeout || 30000
      };
      
      console.log("Request body:", requestBody);
      
      // Make initial POST request to start the scrape
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
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
      
      // Parse the initial response which contains the crawl ID and result URL
      const initialResponse = await response.json();
      console.log("FireCrawl initial response:", initialResponse);
      
      if (!initialResponse.id) {
        throw new Error('No crawl ID returned from Firecrawl API');
      }
      
      // Begin polling for results
      const resultUrl = `https://api.firecrawl.dev/v1/scrape/${initialResponse.id}`;
      console.log("Polling for crawl results from:", resultUrl);
      
      // Polling configuration
      const maxRetries = 10; // Maximum number of polling attempts
      const pollingDelay = 3000; // 3 seconds between polls
      let attempts = 0;
      let detailedResults: any = null;
      
      // Start polling loop
      while (attempts < maxRetries) {
        console.log(`Polling attempt ${attempts + 1} of ${maxRetries}`);
        
        const detailsResponse = await fetch(resultUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        });
        
        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json();
          console.error("Error fetching crawl details:", errorData);
          throw new Error(`Failed to fetch crawl details: ${errorData.message || detailsResponse.statusText}`);
        }
        
        detailedResults = await detailsResponse.json();
        console.log("Crawl status:", detailedResults.status);
        
        // Check if the crawl is complete
        if (detailedResults.status === "completed" || 
            detailedResults.status === "completed_with_errors" || 
            detailedResults.status === "failed") {
          console.log("Crawl completed with status:", detailedResults.status);
          break; // Exit polling loop if we have a completion status
        }
        
        // If still processing, wait before next attempt
        if (detailedResults.status === "scraping" || detailedResults.status === "processing") {
          console.log(`Crawl in progress (${detailedResults.status}), waiting before next poll...`);
          await new Promise(resolve => setTimeout(resolve, pollingDelay));
          attempts++;
          continue;
        }
        
        // For any unexpected status, just use what we have
        console.log("Unexpected status received:", detailedResults.status);
        break;
      }
      
      // If we reached max attempts but crawl is still in progress
      if (attempts >= maxRetries && 
          (detailedResults.status === "scraping" || detailedResults.status === "processing")) {
        console.log("Maximum polling attempts reached. Returning partial results.");
        detailedResults.status = "timeout";
        detailedResults.message = "Crawl is taking longer than expected. Partial results returned.";
      }
      
      return detailedResults;
    } catch (error) {
      console.error("Error in API client crawl:", error);
      throw error;
    }
  }
}
