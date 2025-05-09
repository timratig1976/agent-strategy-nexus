
/**
 * Primary service for handling website crawling
 */

import { toast } from "sonner";
import { FirecrawlApiClient } from "./api-client";
import { processApiResponse } from "./content-processor";
import { StorageClient } from "./storage-client";
import type { CrawlOptions, WebsiteCrawlResult, CrawlJobResponse, CrawlStatusResponse } from "./types";

/**
 * Main service class for FireCrawl operations
 */
export class FirecrawlService {
  /**
   * Save API key to local storage
   */
  static saveApiKey(apiKey: string): void {
    FirecrawlApiClient.saveApiKey(apiKey);
  }

  /**
   * Get API key from local storage
   */
  static getApiKey(): string | null {
    return FirecrawlApiClient.getApiKey();
  }

  /**
   * Test the validity of an API key
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    return FirecrawlApiClient.testApiKey(apiKey);
  }

  /**
   * Crawl a website using the stored API key
   * If strategyId is provided, the results will be saved to the database
   */
  static async crawlWebsite(url: string, options?: CrawlOptions, strategyId?: string): Promise<WebsiteCrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }

    try {
      // Get crawl results
      const crawlResult = await this.crawlWithApiKey(url, apiKey, options);
      
      // Save to database if strategy ID is provided
      if (strategyId && crawlResult.success) {
        console.log(`Saving crawl results to database for strategy: ${strategyId}`);
        
        // Add the strategy ID to the result
        crawlResult.strategyId = strategyId;
        
        // Store the results in the database
        await StorageClient.saveCrawlResults(strategyId, crawlResult);
      }
      
      return crawlResult;
    } catch (error) {
      console.error("Error in crawlWebsite:", error);
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred during crawl'}`,
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error occurred during crawl'
      };
    }
  }

  /**
   * Crawl a website with a specific API key
   */
  static async crawlWithApiKey(url: string, apiKey: string, options?: CrawlOptions): Promise<WebsiteCrawlResult> {
    try {
      // Make the API call using the API client
      const apiResponse = await FirecrawlApiClient.crawlWithApiKey(url, apiKey, options);
      
      // Process the API response
      return processApiResponse(apiResponse, url);
    } catch (error) {
      console.error("Error crawling website:", error);
      // Return the error directly instead of using a fallback
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred during crawl'}`,
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error occurred during crawl'
      };
    }
  }
  
  /**
   * Start a multi-page crawl job
   * This is for more extensive crawling of websites with many pages
   */
  static async startCrawlJob(
    url: string, 
    options?: { 
      depth?: number; 
      maxPages?: number; 
      includeExternalLinks?: boolean; 
      selectors?: string[];
    }
  ): Promise<CrawlJobResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }
    
    try {
      return await FirecrawlApiClient.startCrawlJob(url, apiKey, options);
    } catch (error) {
      console.error("Error starting crawl job:", error);
      throw error;
    }
  }
  
  /**
   * Check the status of a crawl job
   */
  static async checkCrawlStatus(jobId: string): Promise<CrawlStatusResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }
    
    try {
      return await FirecrawlApiClient.checkCrawlStatus(jobId, apiKey);
    } catch (error) {
      console.error("Error checking crawl status:", error);
      throw error;
    }
  }
  
  /**
   * Complete crawl job processing
   * This method handles polling for job completion and processing the results
   */
  static async completeCrawlJob(jobId: string, url: string, strategyId?: string): Promise<WebsiteCrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      toast.error('FireCrawl API key not found. Please set it in settings.');
      throw new Error('API key not found');
    }
    
    try {
      // Polling configuration
      const maxRetries = 20;
      const pollingDelay = 3000; // 3 seconds between polls
      let attempts = 0;
      
      // Polling loop
      while (attempts < maxRetries) {
        console.log(`Checking crawl job status (attempt ${attempts + 1} of ${maxRetries})`);
        
        const statusResult = await this.checkCrawlStatus(jobId);
        
        // Check if the crawl is complete
        if (statusResult.status === "completed" || 
            statusResult.status === "completed_with_errors" || 
            statusResult.status === "failed") {
          console.log("Crawl job completed with status:", statusResult.status);
          
          // Process the results
          const result = {
            success: true,
            pagesCrawled: statusResult.completed,
            contentExtracted: statusResult.completed > 0,
            summary: `Crawled ${statusResult.completed} pages out of ${statusResult.total}`,
            keywordsFound: [],  // Need to extract from data
            technologiesDetected: [], // Need to extract from data
            data: statusResult.data || [],
            id: jobId,
            url: url,
            status: statusResult.status
          };
          
          // Save to database if strategy ID is provided
          if (strategyId) {
            console.log(`Saving crawl job results to database for strategy: ${strategyId}`);
            await StorageClient.saveCrawlResults(strategyId, result);
          }
          
          return result;
        }
        
        // If still processing, wait before next attempt
        await new Promise(resolve => setTimeout(resolve, pollingDelay));
        attempts++;
      }
      
      // If we reached max attempts but crawl is still in progress
      console.log("Maximum polling attempts reached. Returning partial results.");
      
      // Get the current state
      const finalStatus = await this.checkCrawlStatus(jobId);
      
      const result = {
        success: false,
        pagesCrawled: finalStatus.completed,
        contentExtracted: finalStatus.completed > 0,
        summary: `Timeout waiting for crawl to complete. Processed ${finalStatus.completed} of ${finalStatus.total} pages.`,
        keywordsFound: [],
        technologiesDetected: [],
        data: finalStatus.data || [],
        id: jobId,
        url: url,
        status: "timeout"
      };
      
      // Still save partial results to database if strategy ID is provided
      if (strategyId) {
        console.log(`Saving partial crawl job results to database for strategy: ${strategyId}`);
        await StorageClient.saveCrawlResults(strategyId, result);
      }
      
      return result;
    } catch (error) {
      console.error("Error completing crawl job:", error);
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred during crawl'}`,
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error occurred during crawl'
      };
    }
  }
  
  /**
   * Get the latest crawl result for a strategy from the database
   */
  static async getLatestCrawlResult(strategyId: string): Promise<WebsiteCrawlResult | null> {
    return StorageClient.getLatestCrawlResult(strategyId);
  }
  
  /**
   * Get all crawl results for a strategy from the database
   */
  static async getAllCrawlResults(strategyId: string): Promise<WebsiteCrawlResult[]> {
    return StorageClient.getAllCrawlResults(strategyId);
  }
}
