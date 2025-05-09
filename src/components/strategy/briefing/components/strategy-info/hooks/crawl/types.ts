
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";

/**
 * Extracted content from database structure
 */
export interface ExtractedContent {
  summary?: string;
  keywords?: string[];
  data?: any[];
  url_type?: 'website' | 'product';
}

/**
 * Database record structure for website crawls
 */
export interface WebsiteCrawlRecord {
  id: string;
  project_id: string;
  url: string;
  status: string;
  extracted_content: ExtractedContent;
  created_at: string;
}

/**
 * State returned by the useCrawlUrl hook
 */
export interface CrawlUrlState {
  crawlingUrl: string | null;
  crawlProgress: number;
  websitePreviewResults: WebsiteCrawlResult | null;
  productPreviewResults: WebsiteCrawlResult | null;
  showWebsitePreview: boolean;
  showProductPreview: boolean;
  setShowWebsitePreview: (show: boolean) => void;
  setShowProductPreview: (show: boolean) => void;
  handleCrawl: (urlType: 'websiteUrl' | 'productUrl') => Promise<{ success: boolean }>;
  hasApiKey: boolean;
  checkApiKey: () => boolean;
}
