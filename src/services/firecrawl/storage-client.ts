
/**
 * Storage client for saving and retrieving FireCrawl data
 * @deprecated Use StorageService from db/storage-service.ts instead
 */

import { WebsiteCrawlResult } from "./types";
import { StorageService } from "./db/storage-service";

/**
 * StorageClient handles database operations for crawl results
 * @deprecated This class is kept for backward compatibility. Use StorageService instead.
 */
export class StorageClient {
  /**
   * Save crawl results to the database
   * 
   * @param strategyId The ID of the strategy
   * @param results The results from the crawl operation
   * @param urlType Whether this is a website or product URL
   * @returns Promise that resolves when the operation completes
   */
  static async saveCrawlResults(
    strategyId: string, 
    results: WebsiteCrawlResult,
    urlType: 'website' | 'product' = 'website'
  ): Promise<void> {
    await StorageService.saveCrawlResults(strategyId, results, urlType);
  }
  
  /**
   * Get the latest crawl result for a strategy
   * 
   * @param strategyId The ID of the strategy
   * @param urlType Whether this is a website or product URL
   * @returns The latest crawl result or null if none found
   */
  static async getLatestCrawlResult(
    strategyId: string,
    urlType: 'website' | 'product' = 'website'
  ): Promise<WebsiteCrawlResult | null> {
    return StorageService.getLatestCrawlResult(strategyId, urlType);
  }
  
  /**
   * Get all crawl results for a strategy
   * 
   * @param strategyId The ID of the strategy
   * @param urlType Whether this is a website or product URL
   * @returns Array of crawl results or empty array if none found
   */
  static async getAllCrawlResults(
    strategyId: string,
    urlType: 'website' | 'product' = 'website'
  ): Promise<WebsiteCrawlResult[]> {
    return StorageService.getAllCrawlResults(strategyId, urlType);
  }
}
