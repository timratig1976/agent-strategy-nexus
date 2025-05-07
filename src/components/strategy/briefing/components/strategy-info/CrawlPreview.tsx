
import React from "react";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { CrawlPreviewProps } from "./types";

const CrawlPreview: React.FC<CrawlPreviewProps> = ({ results, show }) => {
  if (!show || !results) return null;

  return (
    <div className="bg-muted/50 p-3 rounded-md text-sm mt-2 max-h-48 overflow-auto">
      <h4 className="font-medium mb-1">Website Crawl Results</h4>
      <p className="text-xs text-muted-foreground mb-2">
        Pages crawled: {results.pagesCrawled || 0} | 
        Technologies: {(results.technologiesDetected || []).join(', ')}
      </p>
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
