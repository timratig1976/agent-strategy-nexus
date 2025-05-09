
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import CrawlPreview from "./CrawlPreview";
import ApiKeyManager from "@/components/marketing/modules/website-crawler/ApiKeyManager";
import CrawlDataDialog from "./CrawlDataDialog";

interface StrategyFormProps {
  localFormValues: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (type: 'websiteUrl' | 'productUrl') => Promise<any>;
  crawlProgress: number;
  websitePreviewResults: any;
  productPreviewResults: any;
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
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-right">
                Strategy Name
              </Label>
              <Input
                id="name"
                name="name"
                value={localFormValues.name || ""}
                onChange={handleInputChange}
                placeholder="My Strategy"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="text-right">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={localFormValues.companyName || ""}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="mt-1"
              />
            </div>
          </div>
          
          {!hasApiKey && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-2">
              <h4 className="font-medium text-amber-800 mb-2">API Key Required</h4>
              <p className="text-sm text-amber-700 mb-3">
                To use the website crawler feature, please set your Firecrawl API key.
              </p>
              <ApiKeyManager onValidated={onApiKeyValidated} />
            </div>
          )}
          
          <div>
            <div className="flex items-end justify-between">
              <Label htmlFor="websiteUrl" className="text-right">
                Website URL
              </Label>
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={crawlingUrl !== null || !hasApiKey || !localFormValues.websiteUrl}
                  onClick={() => handleCrawl("websiteUrl")}
                  className="text-xs"
                >
                  {crawlingUrl === "websiteUrl" ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Crawling...
                    </>
                  ) : (
                    "Crawl"
                  )}
                </Button>
              </div>
            </div>
            <div className="flex mt-1 space-x-2">
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={localFormValues.websiteUrl || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="flex-1"
              />
            </div>
            {crawlingUrl === "websiteUrl" && (
              <Progress value={crawlProgress} className="h-1 mt-2" />
            )}
            {/* Website preview with view data dialog */}
            {showWebsitePreview && (
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Crawl Results</span>
                  <div className="flex items-center gap-2">
                    <CrawlDataDialog crawlResult={websitePreviewResults} title="Website Crawl Data" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowWebsitePreview(false)}
                      className="text-xs h-6"
                    >
                      Hide
                    </Button>
                  </div>
                </div>
                <CrawlPreview
                  results={websitePreviewResults}
                  show={showWebsitePreview}
                  source="website"
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="productDescription" className="text-right">
              Product Description
            </Label>
            <Textarea
              id="productDescription"
              name="productDescription"
              value={localFormValues.productDescription || ""}
              onChange={handleInputChange}
              placeholder="Describe your product or service"
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-end justify-between">
              <Label htmlFor="productUrl" className="text-right">
                Product URL
              </Label>
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={crawlingUrl !== null || !hasApiKey || !localFormValues.productUrl}
                  onClick={() => handleCrawl("productUrl")}
                  className="text-xs"
                >
                  {crawlingUrl === "productUrl" ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Crawling...
                    </>
                  ) : (
                    "Crawl"
                  )}
                </Button>
              </div>
            </div>
            <div className="flex mt-1 space-x-2">
              <Input
                id="productUrl"
                name="productUrl"
                value={localFormValues.productUrl || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/product"
                className="flex-1"
              />
            </div>
            {crawlingUrl === "productUrl" && (
              <Progress value={crawlProgress} className="h-1 mt-2" />
            )}
            {/* Product preview with view data dialog */}
            {showProductPreview && (
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Crawl Results</span>
                  <div className="flex items-center gap-2">
                    <CrawlDataDialog crawlResult={productPreviewResults} title="Product Crawl Data" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowProductPreview(false)}
                      className="text-xs h-6"
                    >
                      Hide
                    </Button>
                  </div>
                </div>
                <CrawlPreview
                  results={productPreviewResults}
                  show={showProductPreview}
                  source="product"
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="additionalInfo" className="text-right">
              Additional Information
            </Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={localFormValues.additionalInfo || ""}
              onChange={handleInputChange}
              placeholder="Additional information about your strategy"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Button type="submit" className="mr-2" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Information"
          )}
        </Button>
      </div>
    </form>
  );
};

export default StrategyForm;
