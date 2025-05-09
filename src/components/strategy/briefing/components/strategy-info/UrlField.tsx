
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight } from "lucide-react";
import CrawlPreview from "./CrawlPreview";
import CrawlDataDialog from "./CrawlDataDialog";

interface UrlFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrawl: () => void;
  isCrawling: boolean;
  crawlProgress: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  previewResults: any;
  crawlingUrl: string | null;
  hasApiKey: boolean;
}

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
  hasApiKey
}) => {
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
        
        {/* Crawl button */}
        {hasApiKey && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCrawl} 
            disabled={isCrawling || !value}
            className="flex gap-1 whitespace-nowrap mt-1"
          >
            {isCrawling && (crawlingUrl === name) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Crawling...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Crawl
              </>
            )}
          </Button>
        )}
        
        {/* Show View Data button only when preview results are available */}
        {previewResults && !isCrawling && (
          <CrawlDataDialog 
            crawlResult={previewResults} 
            title={`${label} Crawl Data`} 
          />
        )}
      </div>
      
      {isCrawling && (crawlingUrl === name) && (
        <Progress value={crawlProgress} className="h-1 mt-1" />
      )}
      
      {showPreview && previewResults && (
        <CrawlPreview 
          results={previewResults} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
};

export default UrlField;
