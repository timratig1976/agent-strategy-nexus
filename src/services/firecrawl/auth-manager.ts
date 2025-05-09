
/**
 * Authentication management for FireCrawl API
 */

/**
 * Manages API key storage and validation for FireCrawl
 */
export class FirecrawlAuthManager {
  private static readonly API_KEY_STORAGE_KEY = "firecrawl_api_key";
  
  /**
   * Save API key to local storage
   * @param apiKey The API key to save
   */
  static saveApiKey(apiKey: string): void {
    if (!apiKey) {
      console.error("Cannot save empty API key");
      return;
    }
    
    try {
      localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
      console.log("FireCrawl API key saved to localStorage");
    } catch (error) {
      console.error("Error saving API key to localStorage:", error);
    }
  }
  
  /**
   * Get API key from local storage
   * @returns The stored API key or null if not found
   */
  static getApiKey(): string | null {
    try {
      return localStorage.getItem(this.API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Error retrieving API key from localStorage:", error);
      return null;
    }
  }
  
  /**
   * Clear API key from local storage
   */
  static clearApiKey(): void {
    try {
      localStorage.removeItem(this.API_KEY_STORAGE_KEY);
      console.log("FireCrawl API key cleared from localStorage");
    } catch (error) {
      console.error("Error clearing API key from localStorage:", error);
    }
  }
  
  /**
   * Validate API key format
   * This only checks the format, not whether the key is valid for API access
   * @param apiKey The API key to validate
   * @returns Boolean indicating if the key format is valid
   */
  static validateApiKeyFormat(apiKey: string): boolean {
    if (!apiKey) return false;
    
    // FireCrawl API keys typically start with "fc-" followed by alphanumeric characters
    return apiKey.startsWith('fc-') && apiKey.length > 5;
  }
}
