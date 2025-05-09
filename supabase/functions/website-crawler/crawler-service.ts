/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  try {
    // Make the API call to Firecrawl REST API with updated request format
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        // Removed the "limit" and "scrapeOptions" keys that caused errors
        format: 'markdown',
        timeout: 30000
      }),
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Firecrawl API error:", errorData);
      throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // If we have an ID, start polling for results
    if (result.id) {
      const resultUrl = `https://api.firecrawl.dev/v1/scrape/${result.id}`;
      console.log("Polling for results from:", resultUrl);
      
      // Maximum number of retries and delay between attempts
      const maxRetries = 10;
      const pollingDelay = 3000; // 3 seconds between polls
      let attempts = 0;
      
      // Implement polling loop
      while (attempts < maxRetries) {
        console.log(`Polling attempt ${attempts + 1} of ${maxRetries}`);
        
        const detailsResponse = await fetch(resultUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        });
        
        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json().catch(() => ({}));
          console.error("Error fetching crawl details:", errorData);
          throw new Error(`Failed to fetch crawl details: ${errorData.message || detailsResponse.statusText}`);
        }
        
        const detailedResults = await detailsResponse.json();
        console.log("Crawl status:", detailedResults.status);
        
        // If the crawl is complete, return the results
        if (detailedResults.status === "completed" || 
            detailedResults.status === "completed_with_errors" || 
            detailedResults.status === "failed") {
          console.log("Crawl completed with status:", detailedResults.status);
          return detailedResults;
        }
        
        // If still scraping, wait before next attempt
        if (detailedResults.status === "scraping" || detailedResults.status === "processing") {
          console.log("Crawl still in progress, waiting before next poll...");
          await new Promise(resolve => setTimeout(resolve, pollingDelay));
          attempts++;
          continue;
        }
        
        // For any other status, return what we have
        console.log("Unexpected status:", detailedResults.status);
        return detailedResults;
      }
      
      // If we've reached the maximum retries, return the last known state
      console.log("Maximum polling attempts reached. Returning current state.");
      const finalDetailsResponse = await fetch(resultUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      
      if (finalDetailsResponse.ok) {
        const finalResults = await finalDetailsResponse.json();
        return {
          ...finalResults,
          status: "timeout",
          message: "Crawl is taking longer than expected. Partial results returned."
        };
      }
    }
    
    // If no ID was returned, return the initial result
    console.log("No crawl ID returned, returning initial result");
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
