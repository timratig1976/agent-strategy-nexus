
/**
 * Polling client for FireCrawl API long-running jobs
 */

import { DEFAULT_POLLING_DELAY, DEFAULT_POLLING_MAX_RETRIES, EXTENDED_POLLING_DELAY, EXTENDED_POLLING_MAX_RETRIES } from './constants';
import { processScrapedData } from './response-processor';

/**
 * Polls for scrape result when a job ID is returned
 */
export async function pollForScrapeResult(
  jobId: string, 
  apiKey: string, 
  url: string, 
  resultUrl: string
): Promise<any> {
  console.log("Polling for scrape results from:", resultUrl);
  
  // Polling configuration
  const maxRetries = DEFAULT_POLLING_MAX_RETRIES;
  const pollingDelay = DEFAULT_POLLING_DELAY;
  let attempts = 0;
  
  // Polling loop
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
    console.log("Scrape status:", detailedResults.status);
    
    // Check if the scrape is complete
    if (detailedResults.status === "completed" || 
        detailedResults.status === "completed_with_errors" || 
        detailedResults.status === "failed") {
      console.log("Scrape completed with status:", detailedResults.status);
      return processScrapedData(detailedResults, url);
    }
    
    // If still processing, wait before next attempt
    await new Promise(resolve => setTimeout(resolve, pollingDelay));
    attempts++;
  }
  
  // If we reached max attempts but scrape is still in progress
  console.log("Maximum polling attempts reached. Returning partial results.");
  
  // Try one more time to get whatever results are available
  const finalResponse = await fetch(resultUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    }
  });
  
  if (finalResponse.ok) {
    const finalResults = await finalResponse.json();
    return {
      ...processScrapedData(finalResults, url),
      status: "timeout",
      message: "Scrape is taking longer than expected. Partial results returned."
    };
  }
  
  return {
    success: false,
    pagesCrawled: 0,
    contentExtracted: false,
    summary: "Timeout while waiting for scrape results",
    keywordsFound: [],
    technologiesDetected: [],
    data: [],
    url: url,
    error: "Timeout while waiting for scrape results"
  };
}

/**
 * Polls for crawl completion - specialized for the /crawl endpoint
 */
export async function pollForCrawlCompletion(
  jobId: string, 
  apiKey: string, 
  resultUrl: string
): Promise<any> {
  console.log("Polling for crawl results from:", resultUrl);
  
  // Maximum number of retries and delay between attempts - more for crawls
  const maxRetries = EXTENDED_POLLING_MAX_RETRIES;
  const pollingDelay = EXTENDED_POLLING_DELAY;
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
