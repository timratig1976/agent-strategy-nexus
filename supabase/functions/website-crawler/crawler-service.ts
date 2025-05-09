
/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  try {
    // Make the API call to Firecrawl REST API with enhanced browser rendering
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
          // Removed javascript and waitUntil which are not supported
          renderOptions: {
            // Enhanced rendering options for JS-heavy sites
            waitForSelector: 'body',
            scrollToBottom: true,
            waitForTimeout: 2000, // Give JS more time to load
          }
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
    
    // If we have an ID, get the detailed results
    if (result.id) {
      const resultUrl = `https://api.firecrawl.dev/v1/crawl/${result.id}`;
      console.log("Fetching detailed results from:", resultUrl);
      
      const detailsResponse = await fetch(resultUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      
      if (detailsResponse.ok) {
        const detailedResults = await detailsResponse.json();
        console.log("Crawl detailed results received");
        return detailedResults;
      }
    }
    
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
  // More sophisticated check for substantial content
  if (!crawlResult || !crawlResult.data || !Array.isArray(crawlResult.data)) {
    return false;
  }
  
  // Check if we have at least one page with meaningful content
  return crawlResult.data.some((page: any) => {
    // Check for substantial HTML content
    if (page.html && page.html.length > 500) {
      // Check for meaningful text content (not just boilerplate)
      const hasStructuredContent = page.html.includes('<div') && 
                                  page.html.includes('<p') && 
                                  page.html.length > 1000;
      return hasStructuredContent;
    }
    
    // Check for substantial markdown content
    if (page.content && page.content.trim().length > 200) {
      // Ignore pages with just error messages
      const lowerContent = page.content.toLowerCase();
      const isErrorPage = lowerContent.includes('access denied') || 
                         lowerContent.includes('404') || 
                         lowerContent.includes('not found');
      return !isErrorPage;
    }
    
    return false;
  });
}
