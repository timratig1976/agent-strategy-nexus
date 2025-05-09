
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import UrlField from "./UrlField";
import { StrategyFormValues } from "@/components/strategy-form";
import { WebsiteCrawlResult } from "@/services/firecrawl";

interface StrategyFormProps {
  localFormValues: StrategyFormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (urlType: 'websiteUrl' | 'productUrl') => Promise<{ success: boolean }>;
  crawlProgress: number;
  websitePreviewResults: WebsiteCrawlResult | null;
  productPreviewResults: WebsiteCrawlResult | null;
  showWebsitePreview: boolean;
  showProductPreview: boolean;
  setShowWebsitePreview: (show: boolean) => void;
  setShowProductPreview: (show: boolean) => void;
  hasApiKey: boolean;
  onApiKeyValidated: () => void;
}

const StrategyForm: React.FC<StrategyFormProps> = ({
  localFormValues,
  handleInputChange,
  handleSubmit,
  isSaving,
  crawlingUrl,
  handleCrawl,
  crawlProgress,
  websitePreviewResults,
  productPreviewResults,
  showWebsitePreview,
  showProductPreview,
  setShowWebsitePreview,
  setShowProductPreview,
  hasApiKey,
  onApiKeyValidated
}) => {
  // Debug to check if results exist
  console.log("StrategyForm: WebsitePreviewResults:", !!websitePreviewResults);
  console.log("StrategyForm: ProductPreviewResults:", !!productPreviewResults);
  console.log("StrategyForm: HasApiKey:", hasApiKey);

  // Handle crawl button clicks
  const onCrawlWebsite = () => handleCrawl('websiteUrl');
  const onCrawlProduct = () => handleCrawl('productUrl');

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Removed the Firecrawl API Key card */}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="text-sm font-medium">
              Company Name
            </label>
            <Input
              id="companyName"
              name="companyName"
              value={localFormValues.companyName || ""}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="mt-1"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="scrapeWebsite" className="text-sm font-medium">
              Scrape Website
            </label>
            <p className="text-xs text-muted-foreground">
              Analyze your website to extract company information automatically.
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={!hasApiKey || isSaving || !!crawlingUrl}
              onClick={() => onCrawlWebsite()}
            >
              {crawlingUrl === 'websiteUrl' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing website...
                </>
              ) : (
                "Analyze Website"
              )}
            </Button>
          </div>
            
          <UrlField
            id="websiteUrl"
            name="websiteUrl"
            label="Website URL"
            value={localFormValues.websiteUrl || ""}
            onChange={handleInputChange}
            onCrawl={onCrawlWebsite}
            isCrawling={!!crawlingUrl}
            crawlProgress={crawlProgress}
            showPreview={showWebsitePreview}
            setShowPreview={setShowWebsitePreview}
            previewResults={websitePreviewResults}
            crawlingUrl={crawlingUrl}
            hasApiKey={hasApiKey}
            crawlStatus={crawlingUrl === 'websiteUrl' ? "Crawling website..." : undefined}
          />

          <UrlField
            id="productUrl"
            name="productUrl"
            label="Product URL"
            value={localFormValues.productUrl || ""}
            onChange={handleInputChange}
            onCrawl={onCrawlProduct}
            isCrawling={!!crawlingUrl}
            crawlProgress={crawlProgress}
            showPreview={showProductPreview}
            setShowPreview={setShowProductPreview}
            previewResults={productPreviewResults}
            crawlingUrl={crawlingUrl}
            hasApiKey={hasApiKey}
            crawlStatus={crawlingUrl === 'productUrl' ? "Crawling product..." : undefined}
          />

          <div>
            <label htmlFor="additionalInfo" className="text-sm font-medium">
              Additional Information
            </label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={localFormValues.additionalInfo || ""}
              onChange={handleInputChange}
              placeholder="Any other relevant information"
              className="mt-1 resize-none h-[38px]"
              rows={1}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="productDescription" className="text-sm font-medium">
              Product / Service Description
            </label>
            <Textarea
              id="productDescription"
              name="productDescription"
              value={localFormValues.productDescription || ""}
              onChange={handleInputChange}
              placeholder="Describe your product or service"
              className="mt-1 resize-none"
              rows={4}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Strategy Information"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StrategyForm;
