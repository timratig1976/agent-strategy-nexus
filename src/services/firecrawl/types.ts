
/**
 * Type definitions for FireCrawl service
 */

/**
 * Options for crawling websites
 */
export interface CrawlOptions {
  timeout?: number;
  depth?: number;
  maxPages?: number;
  includeExternalLinks?: boolean;
  selectors?: string[];
  keywords?: string[];
}

/**
 * Response for website crawl operations
 */
export interface WebsiteCrawlResult {
  success: boolean;
  pagesCrawled: number;
  contentExtracted: boolean;
  summary: string;
  keywordsFound: string[];
  technologiesDetected: string[];
  data: any[];
  url: string;
  id?: string;
  error?: string;
  status?: string;
  strategyId?: string; // Added for storage operations
}

/**
 * Response when starting a crawl job
 */
export interface CrawlJobResponse {
  success: boolean;
  id?: string;
  url?: string;
  error?: string;
}

/**
 * Response when checking crawl status
 */
export interface CrawlStatusResponse {
  id: string;
  status: "created" | "processing" | "completed" | "completed_with_errors" | "failed" | "timeout";
  total: number;
  completed: number;
  creditsUsed: number;
  expiresAt: string;
  data?: any[];
  error?: string;
}

/**
 * Database storage for crawl results
 */
export interface CrawlStorageRecord {
  id: string;
  strategy_id: string;
  url: string;
  status: string;
  extracted_content: {
    data: any[];
    metadata?: any;
  };
  pages_crawled: number;
  keywords: string[];
  technologies: string[];
  content_extracted: boolean;
  summary: string;
  crawled_at: string;
}
