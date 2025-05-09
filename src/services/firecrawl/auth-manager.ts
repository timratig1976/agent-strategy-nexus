
/**
 * Authentication manager for FireCrawl API
 */

export class FirecrawlAuthManager {
  private static readonly API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  /**
   * Test if an API key is valid
   * @param apiKey The API key to test
   * @returns Promise resolving to true if valid, false otherwise
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      // Make a simple request to validate the API key
      const response = await fetch('https://api.firecrawl.dev/v1/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error("Error validating API key:", error);
      return false;
    }
  }

  /**
   * Save the API key to localStorage
   * @param apiKey The API key to save
   */
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log("API key saved to localStorage");
  }

  /**
   * Get the API key from localStorage
   * @returns The API key or null if not found
   */
  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  /**
   * Clear the API key from localStorage
   */
  static clearApiKey(): void {
    localStorage.removeItem(this.API_KEY_STORAGE_KEY);
    console.log("API key removed from localStorage");
  }
}
