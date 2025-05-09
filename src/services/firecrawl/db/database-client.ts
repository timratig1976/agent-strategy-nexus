
/**
 * Low-level database operations for FireCrawl service
 */

import { supabase } from "@/integrations/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { WebsiteCrawlRecord } from "../types/storage-types";

/**
 * DatabaseClient provides low-level database access for the storage service
 */
export class DatabaseClient {
  private static readonly CRAWLS_TABLE = "website_crawls";
  
  // Simplified Supabase client to avoid deep type inference
  private static get db(): SupabaseClient<any> {
    return supabase as SupabaseClient<any>;
  }
  
  /**
   * Insert a new crawl record
   */
  static async insertCrawlRecord(record: any): Promise<WebsiteCrawlRecord | null> {
    console.log("Inserting new crawl record into database");
    
    try {
      const { error, data } = await this.db
        .from(this.CRAWLS_TABLE)
        .insert(record)
        .select();
      
      if (error) {
        console.error("Error inserting crawl record:", error);
        return null;
      }
      
      return data?.[0] as WebsiteCrawlRecord || null;
    } catch (err) {
      console.error("Exception inserting crawl record:", err);
      return null;
    }
  }
  
  /**
   * Query for crawl records by strategy ID and URL type
   */
  static async queryCrawlRecords(
    strategyId: string,
    urlType: 'website' | 'product',
    limit: number = 1
  ): Promise<WebsiteCrawlRecord[] | null> {
    console.log(`Querying for ${urlType} crawl records for strategy ${strategyId}`);
    
    try {
      // Fix: Use contains instead of direct path query for JSON fields
      const query = this.db
        .from(this.CRAWLS_TABLE)
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      // Add filter for url_type if specified
      if (urlType) {
        query.contains('extracted_content', { url_type: urlType });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error querying crawl records:", error);
        return null;
      }
      
      return data as WebsiteCrawlRecord[] || null;
    } catch (err) {
      console.error("Exception querying crawl records:", err);
      return null;
    }
  }
}
