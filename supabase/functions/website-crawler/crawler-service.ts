
/**
 * Core service for handling website crawling operations
 */
export async function crawlWebsite(url: string, apiKey: string) {
  console.log("Crawling website:", url);
  
  try {
    // Make the API call to Firecrawl REST API using the /scrape endpoint
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'html'],
        timeout: 30000
      }),
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Firecrawl API error:", errorData);
      throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
    }
    
    // Parse the response
    const result = await response.json();
    
    // Normal scrape requests immediately return data in result.data
    if (result.data) {
      console.log("Scrape completed successfully with direct data");
      return result;
    }
    
    // For larger sites or complex scrapes that may return a job ID, implement fallback polling
    if (result.id) {
      console.log("Scrape request returned a job ID for polling:", result.id);
      return await pollForScrapeCompletion(result.id, apiKey);
    }
    
    console.log("Unexpected response format:", result);
    return result;
  } catch (error) {
    console.error("Error crawling website:", error);
    throw new Error(`Failed to crawl website: ${error.message || error}`);
  }
}

/**
 * Alternative implementation using the /crawl endpoint
 * This is for more extensive crawling of websites with many pages
 */
export async function crawlWebsiteMultiPage(
  url: string, 
  apiKey: string, 
  options?: { 
    depth?: number; 
    maxPages?: number; 
    includeExternalLinks?: boolean;
  }
) {
  console.log("Starting multi-page crawl for website:", url);
  
  try {
    // Configure the request
    const requestBody = {
      url: url,
      formats: ['markdown', 'html'],
      depth: options?.depth || 2,
      maxPages: options?.maxPages || 50,
      includeExternalLinks: options?.includeExternalLinks || false
    };
    
    console.log("Crawl request configuration:", requestBody);
    
    // Make the API call to Firecrawl REST API using the /crawl endpoint
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Firecrawl API error:", errorData);
      throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
    }
    
    // Parse the response - this should be a job ID
    const result = await response.json();
    
    if (!result.id) {
      throw new Error("Firecrawl did not return a job ID for crawl");
    }
    
    console.log("Crawl job started with ID:", result.id);
    
    // For /crawl endpoint, we always need to poll for completion
    return await pollForCrawlCompletion(result.id, apiKey);
  } catch (error) {
    console.error("Error starting multi-page crawl:", error);
    throw new Error(`Failed to start crawl: ${error.message || error}`);
  }
}

/**
 * Polls for scrape completion when a job ID is returned
 */
async function pollForScrapeCompletion(jobId: string, apiKey: string) {
  const resultUrl = `https://api.firecrawl.dev/v1/scrape/${jobId}`;
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
      console.error("Error fetching scrape details:", errorData);
      throw new Error(`Failed to fetch scrape details: ${errorData.message || detailsResponse.statusText}`);
    }
    
    const detailedResults = await detailsResponse.json();
    
    // If the scrape is complete, return the results
    if (detailedResults.status === "completed" || 
        detailedResults.status === "completed_with_errors" || 
        detailedResults.status === "failed") {
      console.log("Scrape completed with status:", detailedResults.status);
      return detailedResults;
    }
    
    // If still in progress, wait before next attempt
    await new Promise(resolve => setTimeout(resolve, pollingDelay));
    attempts++;
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
      message: "Scrape is taking longer than expected. Partial results returned."
    };
  }
  
  throw new Error("Failed to retrieve scrape results after multiple attempts");
}

/**
 * Similar to pollForScrapeCompletion, but for the /crawl endpoint
 */
async function pollForCrawlCompletion(jobId: string, apiKey: string) {
  const resultUrl = `https://api.firecrawl.dev/v1/crawl/${jobId}`;
  console.log("Polling for crawl results from:", resultUrl);
  
  // Maximum number of retries and delay between attempts
  const maxRetries = 20; // More retries for crawls since they take longer
  const pollingDelay = 5000; // 5 seconds between polls
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
    
    // If the crawl is complete, return the results
    if (detailedResults.status === "completed" || 
        detailedResults.status === "completed_with_errors" || 
        detailedResults.status === "failed") {
      console.log("Crawl completed with status:", detailedResults.status);
      return detailedResults;
    }
    
    // Log progress
    console.log(`Crawl progress: ${detailedResults.completed || 0}/${detailedResults.total || 0} pages`);
    
    // If still in progress, wait before next attempt
    await new Promise(resolve => setTimeout(resolve, pollingDelay));
    attempts++;
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
  
  throw new Error("Failed to retrieve crawl results after multiple attempts");
}

/**
 * Checks if the crawl result contains substantial content
 */
export function hasSubstantialContent(crawlResult: any): boolean {
  // More sophisticated check for substantial content
  if (!crawlResult || !crawlResult.data) {
    return false;
  }
  
  // Handle both scrape (single object) and crawl (array) response formats
  const dataToCheck = Array.isArray(crawlResult.data) ? crawlResult.data : [crawlResult.data];
  
  // Check if we have at least one page with meaningful content
  return dataToCheck.some((page: any) => {
    // Check for substantial HTML content
    if (page.html && page.html.length > 500) {
      // Check for meaningful text content (not just boilerplate)
      const hasStructuredContent = page.html.includes('<div') && 
                                  page.html.includes('<p') && 
                                  page.html.length > 1000;
      return hasStructuredContent;
    }
    
    // Check for substantial markdown content
    if (page.markdown && page.markdown.trim().length > 200) {
      // Ignore pages with just error messages
      const lowerContent = page.markdown.toLowerCase();
      const isErrorPage = lowerContent.includes('access denied') || 
                         lowerContent.includes('404') || 
                         lowerContent.includes('not found');
      return !isErrorPage;
    }
    
    // Check legacy format (content field)
    if (page.content && page.content.trim().length > 200) {
      const lowerContent = page.content.toLowerCase();
      const isErrorPage = lowerContent.includes('access denied') || 
                         lowerContent.includes('404') || 
                         lowerContent.includes('not found');
      return !isErrorPage;
    }
    
    return false;
  });
}
