
/**
 * Database operations for FireCrawl scraper
 */
import { supabase } from "@/integrations/supabase/client";
import { ScrapeResponse } from "../types/scraper-types";

/**
 * Handles saving crawl results to the database
 */
export class ScraperDbService {
  /**
   * Save crawl results to the database
   * @param url The URL that was scraped
   * @param strategyId The strategy ID
   * @param response The scrape response
   * @param urlType The type of URL (website or product)
   * @returns Promise that resolves when saved
   */
  static async saveCrawlResult(
    url: string,
    strategyId: string | undefined,
    response: ScrapeResponse,
    urlType: 'website' | 'product' = 'website'
  ): Promise<void> {
    if (!strategyId) {
      console.log("No strategy ID provided, skipping database save");
      return;
    }

    // Check if we have valid data to save
    if (!response.success || !response.data) {
      console.error("Cannot save invalid response to database");
      return;
    }

    try {
      console.log(`Saving ${urlType} crawl result for strategy ${strategyId}`);

      const data = {
        project_id: strategyId,
        url: url,
        status: 'completed',
        extracted_content: {
          data: [response.data],
          summary: "Website content extracted successfully",
          keywords: [],
          url_type: urlType
        }
      };

      // Save to the database
      const { error } = await supabase.from('website_crawls').insert(data);
      
      if (error) {
        console.error("Error saving crawl results:", error);
      } else {
        console.log(`${urlType} crawl result saved successfully`);
      }
    } catch (error) {
      console.error("Error in saveCrawlResult:", error);
    }
  }
}
