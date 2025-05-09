
/**
 * Storage client for saving and retrieving FireCrawl data
 */

import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult, CrawlStorageRecord } from "./types";

/**
 * StorageClient handles database operations for crawl results
 */
export class StorageClient {
  private static readonly TABLE_NAME = "website_crawl_results";
  
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
    try {
      if (!strategyId) {
        console.error("Cannot save crawl results: No strategy ID provided");
        return;
      }
      
      // Prepare the record for storage
      const record = {
        strategy_id: strategyId,
        url: results.url,
        url_type: urlType,
        extracted_content: {
          data: results.data,
          summary: results.summary
        },
        pages_crawled: results.pagesCrawled,
        keywords: results.keywordsFound,
        technologies: results.technologiesDetected,
        content_extracted: results.contentExtracted,
        summary: results.summary,
        crawled_at: new Date().toISOString()
      };
      
      // Insert into the database
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .insert(record);
      
      if (error) {
        console.error("Error saving crawl results:", error);
      } else {
        console.log(`${urlType} crawl results saved for strategy ${strategyId}`);
      }
    } catch (err) {
      console.error("Error in saveCrawlResults:", err);
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
      
      // Query for the latest result
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('url_type', urlType)
        .order('crawled_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching crawl results:", error);
        return null;
      }
      
      if (data && data.length > 0) {
        return this.mapFromDatabaseRecord(data[0]);
      }
      
      return null;
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
      
      // Query for all results
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('url_type', urlType)
        .order('crawled_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching crawl results:", error);
        return [];
      }
      
      if (data && data.length > 0) {
        return data.map(record => this.mapFromDatabaseRecord(record));
      }
      
      return [];
    } catch (err) {
      console.error("Error in getAllCrawlResults:", err);
      return [];
    }
  }
  
  /**
   * Map a database record to a WebsiteCrawlResult
   */
  private static mapFromDatabaseRecord(record: CrawlStorageRecord): WebsiteCrawlResult {
    return {
      success: true,
      pagesCrawled: record.pages_crawled || 0,
      contentExtracted: record.content_extracted || false,
      summary: record.summary || "",
      keywordsFound: record.keywords || [],
      technologiesDetected: record.extracted_content?.technologies || [],
      data: record.extracted_content?.data || [],
      url: record.url,
      id: record.id,
      strategyId: record.strategy_id
    };
  }
}
