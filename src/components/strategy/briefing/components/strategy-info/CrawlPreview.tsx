
import React from "react";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { CrawlPreviewProps } from "./types";
import { AlertTriangle } from "lucide-react";

const CrawlPreview: React.FC<CrawlPreviewProps> = ({ results, show, source = 'website' }) => {
  if (!show || !results) return null;

  // Check if there's an error
  const hasError = results.error || !results.success;

  return (
    <div className="bg-muted/50 p-3 rounded-md text-sm mt-2 max-h-48 overflow-auto">
      <h4 className="font-medium mb-1">{source === 'website' ? 'Website' : 'Product Page'} Crawl Results</h4>
      <p className="text-xs text-muted-foreground mb-2">
        Pages crawled: {results.pagesCrawled || 0} | 
        Technologies: {(results.technologiesDetected || []).join(', ')}
      </p>
      
      {hasError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded-md flex items-start space-x-2 mb-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            Error crawling {source === 'website' ? 'website' : 'product page'}: {results.error}
          </div>
        </div>
      )}
      
      <p className="text-xs">{results.summary}</p>
      {results.keywordsFound && results.keywordsFound.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium">Keywords:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {results.keywordsFound.map((keyword, i) => (
              <span key={i} className="bg-primary/10 text-xs px-2 py-0.5 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrawlPreview;
