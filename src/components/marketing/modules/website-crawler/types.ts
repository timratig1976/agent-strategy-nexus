
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
