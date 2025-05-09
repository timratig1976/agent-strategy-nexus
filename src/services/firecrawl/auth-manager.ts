
/**
 * Authentication manager for FireCrawl API
 */

export class FirecrawlAuthManager {
  private static readonly API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  /**
   * Test if an API key has valid format
   * @param apiKey The API key to test
   * @returns True if key has valid format, false otherwise
   */
  static validateApiKeyFormat(apiKey: string): boolean {
    if (!apiKey || !apiKey.trim() || !apiKey.startsWith('fc-')) {
      console.log("Invalid API key format");
      return false;
    }
    return true;
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
