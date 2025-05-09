
/**
 * Crawler client for FireCrawl API multi-page crawling operations
 */

import { CrawlJobResponse, CrawlStatusResponse } from './types';
import { CRAWL_ENDPOINT, DEFAULT_FORMATS } from './constants';
import { pollForCrawlCompletion } from './polling-client';

/**
 * Handles the crawling operations with the FireCrawl API
 */
export class CrawlerClient {
  /**
   * Start a crawl job using the /crawl endpoint
   * This method starts a crawl job and returns a job ID
   */
  static async startCrawlJob(
    url: string, 
    apiKey: string, 
    options?: { 
      depth?: number, 
      maxPages?: number, 
      includeExternalLinks?: boolean,
      selectors?: string[]
    }
  ): Promise<CrawlJobResponse> {
    try {
      console.log('Starting crawl job for URL:', url);
      
      const requestBody = {
        url: url,
        formats: DEFAULT_FORMATS,
        depth: options?.depth || 2,
        maxPages: options?.maxPages || 50,
        includeExternalLinks: options?.includeExternalLinks || false,
        selectors: options?.selectors || []
      };
      
      console.log("Crawl request body:", requestBody);
      
      // Make the crawl request
      const response = await fetch(CRAWL_ENDPOINT, {
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
      const resultUrl = `${CRAWL_ENDPOINT}/${jobId}`;
      console.log('Checking status of crawl job:', jobId);
      
      const response = await fetch(resultUrl, {
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
   * Complete a crawl job by polling until finished
   */
  static async completeCrawlJob(jobId: string, apiKey: string): Promise<any> {
    try {
      const resultUrl = `${CRAWL_ENDPOINT}/${jobId}`;
      return await pollForCrawlCompletion(jobId, apiKey, resultUrl);
    } catch (error) {
      console.error("Error completing crawl job:", error);
      throw error;
    }
  }
}
