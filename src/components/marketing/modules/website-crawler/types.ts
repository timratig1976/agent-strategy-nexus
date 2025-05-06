
export interface WebsiteCrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
  error?: string;
  // Fields for display
  pagesCrawled?: number;
  contentExtracted?: boolean;
  summary?: string;
  keywordsFound?: string[];
  technologiesDetected?: string[];
}

// Define additional type for saving website crawl data to strategy metadata
export interface WebsiteCrawlData {
  url: string;
  summary: string;
  keywordsFound: string[];
  technologiesDetected: string[];
  pagesCrawled: number;
}
