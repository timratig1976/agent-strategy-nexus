
/**
 * Constants used across the FireCrawl service
 */

export const API_KEY_STORAGE_KEY = 'firecrawl_api_key';
export const FIRECRAWL_API_BASE_URL = 'https://api.firecrawl.dev';
export const FIRECRAWL_API_VERSION = 'v1';

// API endpoints
export const SCRAPE_ENDPOINT = `${FIRECRAWL_API_BASE_URL}/${FIRECRAWL_API_VERSION}/scrape`;
export const CRAWL_ENDPOINT = `${FIRECRAWL_API_BASE_URL}/${FIRECRAWL_API_VERSION}/crawl`;

// Polling configuration
export const DEFAULT_POLLING_MAX_RETRIES = 10;
export const DEFAULT_POLLING_DELAY = 3000; // 3 seconds
export const EXTENDED_POLLING_MAX_RETRIES = 20;
export const EXTENDED_POLLING_DELAY = 5000; // 5 seconds for more complex operations

// Default request settings
export const DEFAULT_FORMATS = ['markdown', 'html'];
export const DEFAULT_TIMEOUT = 30000;
export const TEST_TIMEOUT = 10000;
