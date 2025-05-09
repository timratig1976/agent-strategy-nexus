
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, Eye } from "lucide-react";
import CrawlPreview from "./CrawlPreview";
import CrawlDataDialog from "./CrawlDataDialog";
import { UrlFieldProps } from "./types";

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
  crawlStatus
}) => {
  // Check if we have data to show the View Data button
  const hasData = !!previewResults;

  // Debug output to help diagnose issues
  console.log(`UrlField rendering for ${name}:`, { 
    value, 
    hasData, 
    hasApiKey, 
    isCrawling, 
    crawlingUrl 
  });

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <Input
            id={id}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="mt-1"
          />
        </div>
        
        {/* Always show Crawl button */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCrawl} 
          disabled={isCrawling || !value || !hasApiKey}
          className="flex gap-1 whitespace-nowrap mt-1"
        >
          {isCrawling && (crawlingUrl === name) ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {crawlStatus || "Crawling..."}
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" />
              Crawl
            </>
          )}
        </Button>
        
        {/* Show View Data button when results are available */}
        {hasData && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="text-xs flex gap-1 items-center mt-1"
          >
            <Eye className="h-3.5 w-3.5" /> View Data
          </Button>
        )}
        
        {/* Show the dialog button when data is available */}
        {hasData && (
          <CrawlDataDialog 
            crawlResult={previewResults} 
            title={`${label} Crawl Data`} 
          />
        )}
      </div>
      
      {isCrawling && (crawlingUrl === name) && (
        <div className="space-y-1">
          <Progress value={crawlProgress} className="h-1 mt-1" />
          {crawlStatus && (
            <p className="text-xs text-muted-foreground">{crawlStatus}</p>
          )}
        </div>
      )}
      
      {showPreview && previewResults && (
        <CrawlPreview 
          results={previewResults} 
          show={showPreview}
          onClose={() => setShowPreview(false)} 
          source={name === "websiteUrl" ? "website" : "product"}
        />
      )}
    </div>
  );
};

export default UrlField;
