
/**
 * Storage client for saving and retrieving FireCrawl data
 */

import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult } from "./types";

/**
 * Interface for database record structure from website_crawls table
 */
interface WebsiteCrawlRecord {
  id: string;
  project_id: string;
  url: string;
  status: string;
  extracted_content: {
    data: any[];
    summary: string;
    keywords: string[];
    url_type: 'website' | 'product';
  };
  created_at: string;
}

/**
 * StorageClient handles database operations for crawl results
 */
export class StorageClient {
  private static readonly TABLE_NAME = "website_crawls";
  
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
        project_id: strategyId, // Using project_id as it exists in website_crawls table
        url: results.url,
        status: results.status || 'completed',
        extracted_content: {
          data: results.data,
          summary: results.summary,
          keywords: results.keywordsFound,
          url_type: urlType
        }
      };
      
      // Insert into the database using the website_crawls table
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
      
      // Break the complex type inference chain by executing the query without type inference
      // and then explicitly casting the result
      const query = supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('project_id', strategyId)
        .eq('extracted_content->url_type', urlType)
        .order('created_at', { ascending: false })
        .limit(1);
        
      // Execute query as any to bypass type inference
      const response = await (query as any);
        
      // Manually extract data and error with explicit typing
      const data = response.data as WebsiteCrawlRecord[] | null;
      const error = response.error;
      
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
      
      // Break the complex type inference chain by executing the query without type inference
      // and then explicitly casting the result
      const query = supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('project_id', strategyId)
        .eq('extracted_content->url_type', urlType)
        .order('created_at', { ascending: false });
        
      // Execute query as any to bypass type inference
      const response = await (query as any);
        
      // Manually extract data and error with explicit typing
      const data = response.data as WebsiteCrawlRecord[] | null;
      const error = response.error;
      
      if (error) {
        console.error("Error fetching crawl results:", error);
        return [];
      }
      
      if (data && data.length > 0) {
        return data.map((record) => this.mapFromDatabaseRecord(record));
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
  private static mapFromDatabaseRecord(record: WebsiteCrawlRecord): WebsiteCrawlResult {
    return {
      success: true,
      pagesCrawled: 1,
      contentExtracted: !!record.extracted_content?.data?.length,
      summary: record.extracted_content?.summary || "",
      keywordsFound: record.extracted_content?.keywords || [],
      technologiesDetected: [], // No longer storing technologies
      data: record.extracted_content?.data || [],
      url: record.url,
      id: record.id,
      strategyId: record.project_id
    };
  }
}
