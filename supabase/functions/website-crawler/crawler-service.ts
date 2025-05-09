
/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  try {
    // Make the API call to Firecrawl REST API
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        limit: 10, // Limit pages for faster response
        scrapeOptions: {
          formats: ['markdown', 'html'],
          timeout: 30000, // 30s timeout
        },
      }),
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Firecrawl API error:", errorData);
      throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Crawl completed successfully");
    return result;
  } catch (error) {
    console.error("Error crawling website:", error);
    throw new Error(`Failed to crawl website: ${error.message || error}`);
  }
}

/**
 * Checks if the crawl result contains substantial content
 */
export function hasSubstantialContent(crawlResult: any): boolean {
  // Check if result has content with sufficient data
  return crawlResult && 
         crawlResult.data && 
         Array.isArray(crawlResult.data) &&
         crawlResult.data.length > 0 && 
         crawlResult.data.some((page: any) => 
           (page.content && page.content.trim().length > 30) || 
           (page.html && page.html.length > 100)
         );
}
