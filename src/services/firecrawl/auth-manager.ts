
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
      if (!apiKey || !apiKey.trim() || !apiKey.startsWith('fc-')) {
        console.log("Invalid API key format");
        return false;
      }

      // Use a simple endpoint that should exist and require authentication
      // Instead of v1/auth/validate which is returning 404
      const response = await fetch('https://api.firecrawl.dev/v1/user/credits', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Log the response for debugging
      console.log("API key validation response:", response.status, response.statusText);
      
      // Any 2xx status code should indicate success
      if (response.status >= 200 && response.status < 300) {
        console.log("API key appears valid (status code indicates success)");
        return true;
      }
      
      // Specific handling for common error cases
      if (response.status === 401 || response.status === 403) {
        console.log("API key rejected by server (unauthorized)");
        return false;
      }
      
      // For other status codes, log them but still consider the key potentially valid
      // if we at least got a response from the API
      console.log("Unexpected status code during validation:", response.status);
      return false;
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
