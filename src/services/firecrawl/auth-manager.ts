
/**
 * Authentication management for FireCrawl API
 */

import { toast } from "sonner";
import { API_KEY_STORAGE_KEY, SCRAPE_ENDPOINT, TEST_TIMEOUT, DEFAULT_FORMATS } from "./constants";

/**
 * Handles API key management and authentication testing
 */
export class FirecrawlAuthManager {
  /**
   * Save API key to local storage
   */
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    console.log('FireCrawl API key saved successfully');
  }

  /**
   * Get API key from local storage
   */
  static getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }

  /**
   * Test the validity of an API key
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      
      const response = await fetch(SCRAPE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: 'https://example.com',
          formats: DEFAULT_FORMATS,
          timeout: TEST_TIMEOUT
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Firecrawl test API error:", errorData);
        return false;
      }
      
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }
}
