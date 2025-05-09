
/**
 * Process and transform content from the Firecrawl API response
 */

import { WebsiteCrawlResult } from "./types";

/**
 * ContentProcessor class for handling data transformation
 */
export class ContentProcessor {
  /**
   * Process the scraped data from the Firecrawl API
   * 
   * @param rawData Raw data from the API
   * @returns WebsiteCrawlResult with processed content
   */
  processScrapedData(rawData: any): WebsiteCrawlResult {
    // Safety check
    if (!rawData || !rawData.success) {
      console.error("Error processing scraped data: Invalid or unsuccessful response", rawData);
      return {
        success: false,
        error: rawData?.error || "Invalid scrape response",
        data: [],
        pagesCrawled: 0,
        contentExtracted: false,
        summary: "Failed to extract content from the website.",
        keywordsFound: [],
        technologiesDetected: [],
        url: rawData?.url || ""
      };
    }

    console.log("Processing scraped data from Firecrawl API");

    try {
      // Handle different response formats
      const dataObject = rawData.data || {};
      
      // Extract markdown content
      let markdownContent = "";
      
      if (dataObject.markdown) {
        // Direct markdown content
        markdownContent = dataObject.markdown;
      } else if (Array.isArray(dataObject) && dataObject.length > 0) {
        // Array of pages with markdown
        markdownContent = dataObject
          .filter(page => page?.markdown)
          .map(page => page.markdown)
          .join("\n\n---\n\n");
      }

      // Extract metadata
      const metadata = dataObject.metadata || rawData.metadata || {};
      
      // Generate a basic summary if none was provided
      const summary = this.generateSummary(markdownContent, metadata);
      
      // Extract keywords from content
      const keywords = this.extractKeywords(markdownContent, metadata);

      // Create a standardized result object
      const result: WebsiteCrawlResult = {
        success: true,
        data: Array.isArray(dataObject) ? dataObject : [dataObject],
        pagesCrawled: rawData.total || 1,
        contentExtracted: !!markdownContent,
        summary,
        keywordsFound: keywords,
        technologiesDetected: [],
        url: metadata.sourceURL || rawData.url || ""
      };

      console.log("Processed crawl results:", {
        url: result.url,
        pagesCrawled: result.pagesCrawled,
        contentExtracted: result.contentExtracted,
        summaryLength: result.summary?.length || 0,
        keywordsCount: result.keywordsFound?.length || 0
      });

      return result;
    } catch (error) {
      console.error("Error processing scraped data:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process scraped data",
        data: [],
        pagesCrawled: 0,
        contentExtracted: false,
        summary: "Failed to process content from the website.",
        keywordsFound: [],
        technologiesDetected: [],
        url: rawData?.url || ""
      };
    }
  }

  /**
   * Generate a summary from the markdown content
   */
  private generateSummary(content: string, metadata: any): string {
    // If content is too short, generate a basic summary from metadata
    if (!content || content.length < 200) {
      if (metadata.title || metadata.description) {
        return `Website titled "${metadata.title || 'Untitled'}" with description: ${metadata.description || 'No description available.'}}`;
      }
      return "Limited content was extracted from this website.";
    }

    // Take the first few paragraphs as a summary (up to ~500 chars)
    const paragraphs = content.split('\n\n');
    let summary = '';
    
    for (const para of paragraphs) {
      if (para.trim() && !para.startsWith('#') && !para.startsWith('![')) {
        summary += para + ' ';
        if (summary.length > 500) break;
      }
    }
    
    return summary.trim() || "Content was extracted but no suitable summary could be generated.";
  }

  /**
   * Extract keywords from the content
   */
  private extractKeywords(content: string, metadata: any): string[] {
    const keywords: string[] = [];
    
    // Use metadata keywords if available
    if (metadata.keywords) {
      if (typeof metadata.keywords === 'string') {
        keywords.push(...metadata.keywords.split(',').map((k: string) => k.trim()));
      } else if (Array.isArray(metadata.keywords)) {
        keywords.push(...metadata.keywords);
      }
    }
    
    // If no keywords, extract from content
    if (keywords.length === 0 && content) {
      // Find words that appear frequently
      const words = content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);
      
      const wordFreq: Record<string, number> = {};
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      // Get top keywords
      const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word);
      
      keywords.push(...sortedWords);
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }
}

/**
 * Helper function to process API response
 */
export function processApiResponse(response: any): WebsiteCrawlResult {
  const processor = new ContentProcessor();
  return processor.processScrapedData(response);
}
