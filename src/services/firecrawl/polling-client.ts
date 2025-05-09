
/**
 * Polling client for FireCrawl API long-running jobs
 */
import { CRAWL_ENDPOINT } from "./constants";

/**
 * Poll for crawl job completion
 * @param jobId The job ID to poll for
 * @param apiKey The FireCrawl API key
 * @param maxAttempts Maximum number of polling attempts (default 30)
 * @param interval Polling interval in milliseconds (default 2000)
 * @returns Promise that resolves with the crawl result
 */
export async function pollForCrawlCompletion(
  jobId: string, 
  apiKey: string, 
  maxAttempts = 30, 
  interval = 2000
): Promise<any> {
  console.log(`Starting polling for job ${jobId}`);
  const resultUrl = `${CRAWL_ENDPOINT}/${jobId}`;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkStatus = async () => {
      try {
        attempts++;
        
        if (attempts > maxAttempts) {
          return reject(new Error(`Max polling attempts (${maxAttempts}) reached for job ${jobId}`));
        }
        
        const response = await fetch(resultUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.message || response.statusText}`);
        }
        
        const statusResult = await response.json();
        
        // Check if the job has completed or failed
        if (statusResult.status === 'completed' || statusResult.status === 'completed_with_errors') {
          console.log(`Crawl job ${jobId} completed with status: ${statusResult.status}`);
          return resolve(statusResult);
        } else if (statusResult.status === 'failed' || statusResult.status === 'timeout') {
          console.error(`Crawl job ${jobId} failed with status: ${statusResult.status}`);
          return reject(new Error(`Job ${jobId} failed with status: ${statusResult.status}`));
        }
        
        console.log(`Crawl job ${jobId} still in progress, polling again (attempt ${attempts}/${maxAttempts})`);
        setTimeout(checkStatus, interval);
        
      } catch (error) {
        console.error(`Error polling crawl job ${jobId}:`, error);
        reject(error);
      }
    };
    
    // Start polling
    setTimeout(checkStatus, interval);
  });
}
