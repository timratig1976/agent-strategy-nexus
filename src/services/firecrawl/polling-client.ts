
/**
 * Polling client for long-running FireCrawl operations
 */

/**
 * Poll for the result of a scrape operation
 */
export async function pollForScrapeResult(
  jobId: string,
  apiKey: string,
  originalUrl: string,
  resultUrl: string,
  maxAttempts = 10
): Promise<any> {
  let attempts = 0;
  const pollInterval = 2000; // 2 seconds between polls
  
  console.log(`Polling for scrape result with job ID: ${jobId}`);
  
  while (attempts < maxAttempts) {
    console.log(`Poll attempt ${attempts + 1} of ${maxAttempts}`);
    
    try {
      const response = await fetch(resultUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error polling for scrape result:", errorData);
        throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Poll result:", result);
      
      // Check if the job is completed
      if (result.status === "completed" || result.status === "completed_with_errors" || result.status === "failed") {
        return {
          success: result.status !== "failed",
          data: result.data,
          url: originalUrl,
          id: jobId,
          status: result.status
        };
      }
      
      // Wait for the polling interval
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    } catch (error) {
      console.error("Error during polling:", error);
      attempts++;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  
  // If we've reached the maximum number of attempts, return a timeout error
  return {
    success: false,
    error: "Polling for scrape result timed out",
    url: originalUrl
  };
}

/**
 * Poll for the result of a crawl operation
 */
export async function pollForCrawlCompletion(
  jobId: string,
  apiKey: string,
  maxAttempts = 15
): Promise<any> {
  let attempts = 0;
  const pollInterval = 3000; // 3 seconds between polls
  const resultUrl = `https://api.firecrawl.dev/v1/crawl/${jobId}`;
  
  console.log(`Polling for crawl completion with job ID: ${jobId}`);
  
  while (attempts < maxAttempts) {
    console.log(`Poll attempt ${attempts + 1} of ${maxAttempts}`);
    
    try {
      const response = await fetch(resultUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error polling for crawl completion:", errorData);
        throw new Error(errorData.message || `API returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Check if the job is completed
      if (result.status === "completed" || result.status === "completed_with_errors" || result.status === "failed") {
        return result;
      }
      
      // Log progress
      console.log(`Crawl progress: ${result.completed || 0}/${result.total || '?'} pages`);
      
      // Wait for the polling interval
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    } catch (error) {
      console.error("Error during polling:", error);
      attempts++;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  
  // If we've reached the maximum number of attempts, return a timeout error
  return {
    success: false,
    error: "Polling for crawl completion timed out",
    status: "timeout"
  };
}
