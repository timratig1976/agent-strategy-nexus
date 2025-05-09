
/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  // Make the API call to Firecrawl
  const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: url,
      limit: 25,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      },
    }),
  });
  
  // Handle API response
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Firecrawl API error:", errorData);
    throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Checks if the crawl result contains substantial content
 */
export function hasSubstantialContent(crawlResult: any): boolean {
  return crawlResult.data && 
         crawlResult.data.length > 0 && 
         crawlResult.data.some((page: any) => 
           (page.content && page.content.trim().length > 30) || 
           (page.html && page.html.length > 100)
         );
}

