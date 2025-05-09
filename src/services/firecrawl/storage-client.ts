
/**
 * Client for storing crawled website data in the database
 */

import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult } from './types';
import { toast } from "sonner";

/**
 * Provides methods for storing and retrieving crawl data in the database
 */
export class StorageClient {
  /**
   * Save website crawl results to the database
   */
  static async saveCrawlResults(strategyId: string, crawlResults: WebsiteCrawlResult): Promise<boolean> {
    try {
      console.log("Saving crawl results for strategy:", strategyId);
      
      // Create a cleaned and prepared version of the data for storage
      const storageData = {
        project_id: strategyId, // Renamed from strategy_id to match DB schema
        url: crawlResults.url,
        status: crawlResults.status || 'completed',
        // Using extracted_content field to store all our data as JSON
        extracted_content: {
          data: crawlResults.data,
          summary: crawlResults.summary,
          pages_crawled: crawlResults.pagesCrawled,
          keywords: crawlResults.keywordsFound,
          technologies: crawlResults.technologiesDetected,
          content_extracted: crawlResults.contentExtracted,
          crawled_at: new Date().toISOString(),
          metadata: crawlResults.data && crawlResults.data[0]?.metadata ? 
            crawlResults.data[0].metadata : {}
        }
      };
      
      // Insert into the website_crawls table
      const { error } = await supabase
        .from('website_crawls')
        .insert(storageData);
      
      if (error) {
        console.error("Error saving crawl results to database:", error);
        return false;
      }
      
      console.log("Successfully saved crawl results to database");
      return true;
    } catch (err) {
      console.error("Failed to save crawl results:", err);
      toast.error("Failed to save crawl results to database");
      return false;
    }
  }
  
  /**
   * Get the most recent website crawl result for a strategy
   */
  static async getLatestCrawlResult(strategyId: string): Promise<WebsiteCrawlResult | null> {
    try {
      // Query the database for the latest crawl result for this strategy
      const { data, error } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('project_id', strategyId) // Using project_id instead of strategy_id
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error retrieving crawl results:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Extract the data from the extracted_content JSON field
      const extractedContent = data.extracted_content || {};
      
      // Transform the database record back into WebsiteCrawlResult format
      const crawlResult: WebsiteCrawlResult = {
        success: true,
        pagesCrawled: extractedContent.pages_crawled || 0,
        contentExtracted: extractedContent.content_extracted || false,
        summary: extractedContent.summary || "",
        keywordsFound: extractedContent.keywords || [],
        technologiesDetected: extractedContent.technologies || [],
        data: extractedContent.data || [],
        url: data.url,
        id: data.id,
        status: data.status
      };
      
      return crawlResult;
    } catch (err) {
      console.error("Failed to retrieve crawl results:", err);
      return null;
    }
  }
  
  /**
   * Get all website crawl results for a strategy
   */
  static async getAllCrawlResults(strategyId: string): Promise<WebsiteCrawlResult[]> {
    try {
      const { data, error } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('project_id', strategyId) // Using project_id instead of strategy_id
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error retrieving all crawl results:", error);
        return [];
      }
      
      // Transform all database records into WebsiteCrawlResult format
      return (data || []).map(record => {
        const extractedContent = record.extracted_content || {};
        
        return {
          success: true,
          pagesCrawled: extractedContent.pages_crawled || 0,
          contentExtracted: extractedContent.content_extracted || false,
          summary: extractedContent.summary || "",
          keywordsFound: extractedContent.keywords || [],
          technologiesDetected: extractedContent.technologies || [],
          data: extractedContent.data || [],
          url: record.url,
          id: record.id,
          status: record.status
        };
      });
    } catch (err) {
      console.error("Failed to retrieve all crawl results:", err);
      return [];
    }
  }
}
