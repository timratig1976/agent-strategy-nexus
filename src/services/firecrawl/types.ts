
/**
 * Type definitions for the FirecrawlService
 */

export interface CrawlOptions {
  limit?: number;
  formats?: string[];
  timeout?: number;
  crawlOptions?: {
    depth?: number;
    maxPages?: number;
    includeExternalLinks?: boolean;
    selectors?: string[];
  };
}

export interface WebsiteCrawlResult {
  success: boolean;
  pagesCrawled: number;
  contentExtracted: boolean;
  summary: string;
  keywordsFound: string[];
  technologiesDetected: string[];
  data: any[];
  id?: string | null;
  url: string;
  status?: string;
  error?: string;
}

export interface CrawlJobResponse {
  success: boolean;
  id: string;
  url: string;
}

export interface CrawlStatusResponse {
  status: string;
  total: number;
  completed: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

