
/**
 * Type definitions for FireCrawl storage services
 */

/**
 * Interface for database record structure from website_crawls table
 */
export interface WebsiteCrawlRecord {
  id: string;
  project_id: string;
  url: string;
  status: string;
  extracted_content: {
    data: any[];
    summary?: string;
    keywords?: string[];
    url_type?: 'website' | 'product';
  };
  created_at: string;
}

/**
 * Interface for record mapper options
 */
export interface RecordMapperOptions {
  includeStrategyId?: boolean;
}
