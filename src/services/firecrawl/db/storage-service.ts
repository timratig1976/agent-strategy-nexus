
/**
 * Storage service for saving and retrieving FireCrawl data
 */

import { WebsiteCrawlResult } from "../types";
import { DatabaseClient } from "./database-client";
import { mapFromDatabaseRecord, prepareForStorage } from "./record-mapper";

/**
 * StorageService handles high-level database operations for crawl results
 */
export class StorageService {
  /**
   * Save crawl results to the database
   * 
   * @param strategyId The ID of the strategy
   * @param results The results from the crawl operation
   * @param urlType Whether this is a website or product URL
   * @returns Promise that resolves with success status
   */
  static async saveCrawlResults(
    strategyId: string, 
    results: WebsiteCrawlResult,
    urlType: 'website' | 'product' = 'website'
  ): Promise<boolean> {
    try {
      if (!strategyId) {
        console.error("Cannot save crawl results: No strategy ID provided");
        return false;
      }
      
      console.log(`Saving ${urlType} crawl results to database for strategy ${strategyId}`);
      
      // Prepare the record for storage
      const record = prepareForStorage(strategyId, results, urlType);
      
      // Insert into the database
      const savedRecord = await DatabaseClient.insertCrawlRecord(record);
      
      if (!savedRecord) {
        console.error("Failed to save crawl results");
        return false;
      }
      
      console.log(`${urlType} crawl results saved successfully with ID: ${savedRecord.id}`);
      return true;
    } catch (err) {
      console.error("Error in saveCrawlResults:", err);
      return false;
    }
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
    try {
      if (!strategyId) {
        console.error("Cannot get crawl results: No strategy ID provided");
        return null;
      }
      
      console.log(`Getting latest ${urlType} crawl result for strategy ${strategyId}`);
      
      // Query for the latest record
      const records = await DatabaseClient.queryCrawlRecords(strategyId, urlType, 1);
      
      if (!records || records.length === 0) {
        console.log(`No ${urlType} crawl results found for strategy ${strategyId}`);
        return null;
      }
      
      console.log(`Found ${urlType} crawl result with ID: ${records[0].id}`);
      return mapFromDatabaseRecord(records[0], { includeStrategyId: true });
    } catch (err) {
      console.error("Error in getLatestCrawlResult:", err);
      return null;
    }
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
    try {
      if (!strategyId) {
        console.error("Cannot get crawl results: No strategy ID provided");
        return [];
      }
      
      // Query for all records
      const records = await DatabaseClient.queryCrawlRecords(strategyId, urlType, 100);
      
      if (!records || records.length === 0) {
        console.log(`No ${urlType} crawl results found for strategy ${strategyId}`);
        return [];
      }
      
      console.log(`Found ${records.length} ${urlType} crawl results for strategy ${strategyId}`);
      return records.map(record => mapFromDatabaseRecord(record, { includeStrategyId: true }));
    } catch (err) {
      console.error("Error in getAllCrawlResults:", err);
      return [];
    }
  }
}
