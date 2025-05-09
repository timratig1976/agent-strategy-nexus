
/**
 * ScraperClient for making API calls to the Firecrawl scraping service
 */

export class ScraperClient {
  private static apiKey: string | null = null;

  /**
   * Set the API key to use for scraping
   * @param apiKey API key for Firecrawl service
   */
  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    console.log("Scraper client API key set successfully");
    
    // Store the API key in local storage for persistence
    try {
      localStorage.setItem('firecrawl_api_key', apiKey);
    } catch (error) {
      console.error("Failed to store API key in local storage:", error);
    }
  }

  /**
   * Clear the API key
   */
  static clearApiKey(): void {
    this.apiKey = null;
    console.log("Scraper client API key cleared");
    
    // Remove from local storage
    try {
      localStorage.removeItem('firecrawl_api_key');
    } catch (error) {
      console.error("Failed to remove API key from local storage:", error);
    }
  }

  /**
   * Get the stored API key
   */
  static getApiKey(): string | null {
    // Try to get from memory first
    if (this.apiKey) {
      return this.apiKey;
    }
    
    // If not in memory, try to get from local storage
    try {
      const storedKey = localStorage.getItem('firecrawl_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
        console.log("Retrieved API key from local storage");
      }
    } catch (error) {
      console.error("Failed to retrieve API key from local storage:", error);
    }
    
    return this.apiKey;
  }

  /**
   * Scrape a URL using the provided API key
   * 
   * @param url URL to scrape
   * @param apiKey API key for the service
   * @param options Optional scraping options
   * @returns Promise resolving to the scraping result
   */
  static async scrapeWithApiKey(url: string, apiKey: string, options?: any): Promise<any> {
    console.log(`Scraping URL with Firecrawl API: ${url}`);
    
    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: url,
          formats: ['markdown', 'html'],
          timeout: options?.timeout || 30000
        }),
      });

      if (!response.ok) {
        console.error(`Firecrawl API error: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `API returned ${response.status}: ${response.statusText}`
        };
      }

      const result = await response.json();
      
      // Log the success result
      console.log(`Firecrawl scrape completed successfully for ${url}`);
      console.log(`Result contains data: ${!!result.data}`);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error(`Error in Firecrawl API call: ${error}`);
      return {
        success: false,
        error: `Failed to connect to Firecrawl API: ${error}`
      };
    }
  }
}
