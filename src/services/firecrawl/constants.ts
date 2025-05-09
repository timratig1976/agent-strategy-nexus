
/**
 * Constants for FireCrawl service
 */

// API Endpoints
export const SCRAPE_ENDPOINT = 'https://api.firecrawl.dev/v1/scrape';
export const CRAWL_ENDPOINT = 'https://api.firecrawl.dev/v1/crawl';

// Default options
export const DEFAULT_FORMATS = ['markdown', 'html'];
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const TEST_TIMEOUT = 10000; // 10 seconds for API test

// Polling configuration
export const DEFAULT_POLL_INTERVAL = 3000; // 3 seconds
export const MAX_POLL_ATTEMPTS = 10;

// Storage keys
export const API_KEY_STORAGE_KEY = 'firecrawl_api_key';
