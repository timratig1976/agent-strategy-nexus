
/**
 * Content processor for FireCrawl API responses
 */
import { WebsiteCrawlResult } from "./types";
import { ScrapeResponse } from "./types/scraper-types";
export { processApiResponse } from './processors/response-processor';

/**
 * Processes crawled content and formats the output
 */
export class ContentProcessor {
  /**
   * Process the scraped data into a consistent output format
   * @param response The raw scraper response
   * @returns WebsiteCrawlResult with formatted data
   */
  processScrapedData(response: ScrapeResponse): WebsiteCrawlResult {
    if (!response.success || !response.data) {
      return {
        success: false,
        pagesCrawled: 0,
        contentExtracted: false,
        summary: "Failed to extract content from website.",
        keywordsFound: [],
        technologiesDetected: [],
        data: [],
        url: "unknown",
        error: response.error || "No data returned from scrape operation"
      };
    }

    // Extract keywords from the markdown content
    const keywordSet = new Set<string>();
    if (response.data.markdown) {
      // Extract potential keywords from headings and important text
      const headingMatches = response.data.markdown.match(/#{1,6}\s+([^\n]+)/g) || [];
      headingMatches.forEach(match => {
        const keyword = match.replace(/#{1,6}\s+/, "").trim();
        if (keyword.length > 2) keywordSet.add(keyword.toLowerCase());
      });

      // Extract emphasized text as keywords
      const emphasisMatches = response.data.markdown.match(/(\*\*|__|\*|_)([^*_]+)\1/g) || [];
      emphasisMatches.forEach(match => {
        const keyword = match.replace(/(\*\*|__|\*|_)/g, "").trim();
        if (keyword.length > 2) keywordSet.add(keyword.toLowerCase());
      });
    }

    // Get source URL from metadata or default to unknown
    const sourceURL = response.data.metadata?.sourceURL || "unknown";
    
    // Create a summary from the first 150 characters of the markdown content
    const summary = response.data.markdown 
      ? `${response.data.markdown.substring(0, 150)}...` 
      : "Content extracted successfully";

    return {
      success: true,
      pagesCrawled: 1,
      contentExtracted: true,
      summary,
      keywordsFound: Array.from(keywordSet).slice(0, 10), // Limit to top 10 keywords
      technologiesDetected: [],
      data: [response.data],
      url: sourceURL,
      id: response.id
    };
  }
}
