
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { UrlFieldProps } from "./types";
import CrawlPreview from "./CrawlPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UrlField: React.FC<UrlFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onCrawl,
  isCrawling,
  crawlProgress,
  showPreview,
  setShowPreview,
  previewResults,
  crawlingUrl,
  hasApiKey,
  crawlStatus // New prop for crawl status
}) => {
  const isProductUrl = name === 'productUrl';
  
  const handleCrawlClick = async () => {
    await onCrawl();
  };

  // Return human-readable status message
  const getStatusMessage = (status: string | undefined) => {
    switch (status) {
      case "initializing":
        return "Initializing crawl...";
      case "scraping":
        return "Scraping website content...";
      case "processing":
        return "Processing data...";
      case "analyzing":
        return "Analyzing website structure...";
      case "completed":
        return "Crawl completed!";
      case "failed":
        return "Crawl failed";
      case "timeout":
        return "Crawl taking longer than expected";
      default:
        return "Crawling...";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input 
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={`https://example.com${isProductUrl ? '/product' : ''}`}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCrawlClick}
          disabled={crawlingUrl !== null || !hasApiKey}
          title={hasApiKey ? 
            `Crawl ${isProductUrl ? 'product page' : 'website'} for information` : 
            "API key required to crawl"}
        >
          {isCrawling ? (
            <div className="animate-spin">
              <Search className="h-4 w-4" />
            </div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        {previewResults && crawlingUrl === null && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>
      {!hasApiKey && (
        <Alert variant="warning" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            FireCrawl API key required. Click "Set FireCrawl API Key" at the top of the form.
          </AlertDescription>
        </Alert>
      )}
      {isCrawling && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">{getStatusMessage(crawlStatus)}</span>
            <span className="text-muted-foreground">{crawlProgress}%</span>
          </div>
          <Progress value={crawlProgress} className="h-1 mt-1" />
        </div>
      )}
      {previewResults && (
        <CrawlPreview 
          results={previewResults} 
          show={showPreview} 
          source={isProductUrl ? 'product' : 'website'} 
        />
      )}
    </div>
  );
};

export default UrlField;
