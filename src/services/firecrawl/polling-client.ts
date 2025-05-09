
/**
 * Polling client for handling long-running FireCrawl API operations
 */

import { SCRAPE_ENDPOINT, DEFAULT_POLL_INTERVAL, MAX_POLL_ATTEMPTS } from './constants';
import { processApiResponse } from './content-processor';

/**
 * Poll for the result of a scrape operation
 * 
 * @param jobId The ID of the job to poll for
 * @param apiKey The API key to use for authentication
 * @param url The original URL that was scraped
 * @param resultUrl The URL to poll for results
 * @returns The scraped data when ready
 */
export async function pollForScrapeResult(
  jobId: string, 
  apiKey: string, 
  url: string,
  resultUrl: string
): Promise<any> {
  console.log(`Polling for results from: ${resultUrl}`);
  
  // Maximum number of retries and delay between attempts
  const maxRetries = MAX_POLL_ATTEMPTS;
  const pollingDelay = DEFAULT_POLL_INTERVAL;
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
    
    // If the scrape is complete, return the processed results
    if (detailedResults.status === "completed" || 
        detailedResults.status === "completed_with_errors" || 
        detailedResults.status === "failed") {
      console.log("Scrape completed with status:", detailedResults.status);
      return processApiResponse(detailedResults, url);
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
    const processedResults = processApiResponse(finalResults, url);
    return {
      ...processedResults,
      status: "timeout",
      message: "Scrape is taking longer than expected. Partial results returned."
    };
  }
  
  throw new Error("Failed to retrieve scrape results after multiple attempts");
}
