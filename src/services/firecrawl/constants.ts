
/**
 * Constants for FireCrawl API
 */

// Base endpoints
export const API_BASE_URL = "https://api.firecrawl.dev/v1";
export const SCRAPE_ENDPOINT = `${API_BASE_URL}/scrape`;
export const CRAWL_ENDPOINT = `${API_BASE_URL}/crawl`;

// Default options
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_FORMATS = ["markdown", "html"];
export const DEFAULT_DEPTH = 2;
export const DEFAULT_MAX_PAGES = 50;
