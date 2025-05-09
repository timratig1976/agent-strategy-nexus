
/**
 * API client for FireCrawl API interactions
 */

import { FirecrawlAuthManager } from './auth-manager';
import { ScraperClient } from './scraper-client';
import { CrawlerClient } from './crawler-client';
import { CrawlJobResponse, CrawlStatusResponse } from './types';

/**
 * Handles API interactions with FireCrawl
 */
export class FirecrawlApiClient {
  /**
   * Save API key to local storage
   */
  static saveApiKey(apiKey: string): void {
    FirecrawlAuthManager.saveApiKey(apiKey);
  }

  /**
   * Get API key from local storage
   */
  static getApiKey(): string | null {
    return FirecrawlAuthManager.getApiKey();
  }

  /**
   * Test the validity of an API key format
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    return FirecrawlAuthManager.validateApiKeyFormat(apiKey);
  }

  /**
   * Crawl a website with the stored API key
   */
  static async crawlWithApiKey(url: string, apiKey: string, options?: { timeout?: number }): Promise<any> {
    return ScraperClient.scrapeWithApiKey(url, apiKey, options);
  }
  
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
    return CrawlerClient.startCrawlJob(url, apiKey, options);
  }

  /**
   * Check the status of a crawl job
   */
  static async checkCrawlStatus(jobId: string, apiKey: string): Promise<CrawlStatusResponse> {
    return CrawlerClient.checkCrawlStatus(jobId, apiKey);
  }
}
