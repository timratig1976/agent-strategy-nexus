
/**
 * Type definitions for the FirecrawlService
 */

export interface CrawlOptions {
  limit?: number;
  formats?: string[];
  timeout?: number;
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
