
/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  try {
    // Import the Firecrawl library dynamically (since we're in Deno environment)
    const { default: FireCrawlApp } = await import('npm:@mendable/firecrawl-js');
    
    // Initialize FireCrawl with the API key
    const app = new FireCrawlApp({ apiKey });
    
    // Call the scrapeUrl method as shown in the example
    const scrapeResult = await app.scrapeUrl(url, {
      formats: ["markdown"]
    });
    
    console.log("Scrape completed successfully");
    return scrapeResult;
  } catch (error) {
    console.error("Error using Firecrawl:", error);
    throw new Error(`Failed to crawl website: ${error.message || error}`);
  }
}

/**
 * Checks if the crawl result contains substantial content
 */
export function hasSubstantialContent(crawlResult: any): boolean {
  // Check if result has content
  return crawlResult && 
         crawlResult.success && 
         crawlResult.data && 
         crawlResult.data.content && 
         crawlResult.data.content.trim().length > 30;
}
