
/**
 * API client for FireCrawl API interactions
 */

import { toast } from "sonner";
import type { CrawlJobResponse, CrawlStatusResponse } from "./types";

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
      
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: 'https://example.com',
          formats: ['markdown'],
          timeout: 10000 // Short timeout for testing
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Firecrawl test API error:", errorData);
        return false;
      }
      
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWithApiKey(url: string, apiKey: string, options?: { timeout?: number }): Promise<any> {
    try {
      console.log('Making scrape request to Firecrawl API for URL:', url);
      
      const requestBody = {
        url: url,
        formats: ['markdown', 'html'],
        timeout: options?.timeout || 30000
      };
      
      console.log("Request body:", requestBody);
      
      // Make the scrape request
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
      
      // Parse the response - scrape endpoints typically return data directly
      const scrapeResult = await response.json();
      console.log("FireCrawl scrape response:", scrapeResult);
      
      // For most scrapes, the data is returned immediately
      if (scrapeResult.success && scrapeResult.data) {
        console.log("Scrape completed successfully with direct data");
        return this.processScrapedData(scrapeResult, url);
      }
      
      // For larger or more complex scrapes that return a job ID, implement polling
      if (scrapeResult.id) {
        console.log("Scrape request returned a job ID for polling:", scrapeResult.id);
        return await this.pollForScrapeResult(scrapeResult.id, apiKey, url);
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
      console.error("Error in API client crawl:", error);
      throw error;
    }
  }
  
  /**
   * NEW: Start a crawl job using the /crawl endpoint
   * This method starts a crawl job and returns a job ID
   */
  static async startCrawlJob(url: string, apiKey: string, options?: { 
    depth?: number, 
    maxPages?: number, 
    includeExternalLinks?: boolean,
    selectors?: string[]
  }): Promise<CrawlJobResponse> {
    try {
      console.log('Starting crawl job for URL:', url);
      
      const requestBody = {
        url: url,
        formats: ['markdown', 'html'],
        depth: options?.depth || 2,
        maxPages: options?.maxPages || 50,
        includeExternalLinks: options?.includeExternalLinks || false,
        selectors: options?.selectors || []
      };
      
      console.log("Crawl request body:", requestBody);
      
      // Make the crawl request
      const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("FireCrawl crawl API error:", errorData);
        throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response - crawl endpoint returns a job ID
      const result = await response.json();
      console.log("FireCrawl crawl job started:", result);
      
      return result as CrawlJobResponse;
    } catch (error) {
      console.error("Error starting crawl job:", error);
      throw error;
    }
  }

  /**
   * Check the status of a crawl job
   */
  static async checkCrawlStatus(jobId: string, apiKey: string): Promise<CrawlStatusResponse> {
    try {
      console.log('Checking status of crawl job:', jobId);
      
      const response = await fetch(`https://api.firecrawl.dev/v1/crawl/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error checking crawl status:", errorData);
        throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
      }
      
      const statusResult = await response.json();
      console.log("Crawl job status:", statusResult);
      
      return statusResult as CrawlStatusResponse;
    } catch (error) {
      console.error("Error checking crawl job status:", error);
      throw error;
    }
  }
  
  /**
   * Process scraped data into a consistent format
   */
  private static processScrapedData(scrapeResult: any, url: string): any {
    // Extract the page data from the result
    const pageData = scrapeResult.data;
    
    // Process into a consistent format
    return {
      success: true,
      pagesCrawled: 1, // Most scrapes are single page
      contentExtracted: true,
      summary: pageData.markdown ? pageData.markdown.substring(0, 300) + "..." : "Content successfully extracted",
      keywordsFound: this.extractKeywords(pageData),
      technologiesDetected: this.detectTechnologies(pageData),
      data: [pageData], // Wrap in an array for consistency with crawl results
      url: url,
      id: scrapeResult.id || null
    };
  }
  
  /**
   * Extract keywords from scraped content
   */
  private static extractKeywords(pageData: any): string[] {
    // Simple keyword extraction based on common patterns
    // This could be enhanced with NLP in a future iteration
    const keywords: string[] = [];
    
    if (pageData.markdown) {
      const content = pageData.markdown.toLowerCase();
      
      // Extract potential keywords from headings
      const headingMatches = content.match(/#{1,6}\s+([a-z0-9\s]+)/g) || [];
      headingMatches.forEach(match => {
        const keyword = match.replace(/#{1,6}\s+/, "").trim();
        if (keyword.length > 3 && !keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      });
      
      // Extract from bold or emphasized text
      const emphasisMatches = content.match(/(\*\*|__|\*|_)([a-z0-9\s]+)\1/g) || [];
      emphasisMatches.forEach(match => {
        const keyword = match.replace(/(\*\*|__|\*|_)/g, "").trim();
        if (keyword.length > 3 && !keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      });
    }
    
    // Limit to top 10 keywords
    return keywords.slice(0, 10);
  }
  
  /**
   * Detect technologies used in the website
   */
  private static detectTechnologies(pageData: any): string[] {
    const technologies: string[] = [];
    
    if (pageData.html) {
      const html = pageData.html.toLowerCase();
      
      // Check for common technologies
      if (html.includes("wordpress")) technologies.push("WordPress");
      if (html.includes("woocommerce")) technologies.push("WooCommerce");
      if (html.includes("shopify")) technologies.push("Shopify");
      if (html.includes("react")) technologies.push("React");
      if (html.includes("vue")) technologies.push("Vue.js");
      if (html.includes("angular")) technologies.push("Angular");
      if (html.includes("bootstrap")) technologies.push("Bootstrap");
      if (html.includes("tailwind")) technologies.push("Tailwind CSS");
      if (html.includes("jquery")) technologies.push("jQuery");
      if (html.includes("google tag manager")) technologies.push("Google Tag Manager");
      if (html.includes("google analytics")) technologies.push("Google Analytics");
      if (html.includes("hubspot")) technologies.push("HubSpot");
      if (html.includes("marketo")) technologies.push("Marketo");
      if (html.includes("mailchimp")) technologies.push("Mailchimp");
    }
    
    return technologies;
  }
  
  /**
   * Poll for scrape result when a job ID is returned
   */
  private static async pollForScrapeResult(jobId: string, apiKey: string, url: string): Promise<any> {
    const resultUrl = `https://api.firecrawl.dev/v1/scrape/${jobId}`;
    console.log("Polling for scrape results from:", resultUrl);
    
    // Polling configuration
    const maxRetries = 10;
    const pollingDelay = 3000; // 3 seconds between polls
    let attempts = 0;
    
    // Polling loop
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
        console.error("Error fetching scrape details:", errorData);
        throw new Error(`Failed to fetch scrape details: ${errorData.message || detailsResponse.statusText}`);
      }
      
      const detailedResults = await detailsResponse.json();
      console.log("Scrape status:", detailedResults.status);
      
      // Check if the scrape is complete
      if (detailedResults.status === "completed" || 
          detailedResults.status === "completed_with_errors" || 
          detailedResults.status === "failed") {
        console.log("Scrape completed with status:", detailedResults.status);
        return this.processScrapedData(detailedResults, url);
      }
      
      // If still processing, wait before next attempt
      await new Promise(resolve => setTimeout(resolve, pollingDelay));
      attempts++;
    }
    
    // If we reached max attempts but scrape is still in progress
    console.log("Maximum polling attempts reached. Returning partial results.");
    
    // Try one more time to get whatever results are available
    const finalResponse = await fetch(resultUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });
    
    if (finalResponse.ok) {
      const finalResults = await finalResponse.json();
      return {
        ...this.processScrapedData(finalResults, url),
        status: "timeout",
        message: "Scrape is taking longer than expected. Partial results returned."
      };
    }
    
    return {
      success: false,
      pagesCrawled: 0,
      contentExtracted: false,
      summary: "Timeout while waiting for scrape results",
      keywordsFound: [],
      technologiesDetected: [],
      data: [],
      url: url,
      error: "Timeout while waiting for scrape results"
    };
  }
}
