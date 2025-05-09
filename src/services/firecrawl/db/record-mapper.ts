
/**
 * Utilities for mapping between database records and domain models
 */

import { WebsiteCrawlResult } from "../types";
import { WebsiteCrawlRecord, RecordMapperOptions } from "../types/storage-types";

/**
 * Map a database record to a WebsiteCrawlResult
 */
export function mapFromDatabaseRecord(record: WebsiteCrawlRecord, options: RecordMapperOptions = {}): WebsiteCrawlResult {
  return {
    success: true,
    pagesCrawled: 1,
    contentExtracted: !!record.extracted_content?.data?.length,
    summary: record.extracted_content?.summary || "",
    keywordsFound: record.extracted_content?.keywords || [],
    technologiesDetected: [], // No longer storing technologies
    data: record.extracted_content?.data || [],
    url: record.url,
    id: record.id,
    strategyId: options.includeStrategyId ? record.strategy_id : undefined
  };
}

/**
 * Prepare a record for storage in the database
 */
export function prepareForStorage(
  strategyId: string, 
  results: WebsiteCrawlResult,
  urlType: 'website' | 'product' = 'website'
) {
  return {
    strategy_id: strategyId,
    url: results.url,
    status: results.status || 'completed',
    extracted_content: {
      data: results.data,
      summary: results.summary,
      keywords: results.keywordsFound,
      url_type: urlType
    }
  };
}
