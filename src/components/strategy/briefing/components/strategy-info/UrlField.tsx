
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Eye } from "lucide-react";
import { UrlFieldProps } from "./types";
import CrawlPreview from "./CrawlPreview";

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
  crawlingUrl
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input 
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={`https://example.com${name === 'productUrl' ? '/product' : ''}`}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onCrawl}
          disabled={crawlingUrl !== null}
          title={`Crawl ${name === 'websiteUrl' ? 'website' : 'product page'} for information`}
        >
          {isCrawling ? (
            <div className="animate-spin">
              <Search className="h-4 w-4" />
            </div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        {previewResults && crawlingUrl === null && name === 'websiteUrl' && (
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
      {isCrawling && (
        <Progress value={crawlProgress} className="h-1 mt-1" />
      )}
      {name === 'websiteUrl' && (
        <CrawlPreview results={previewResults} show={showPreview} />
      )}
    </div>
  );
};

export default UrlField;
