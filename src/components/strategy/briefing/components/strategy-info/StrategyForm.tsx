
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
import UrlField from "./UrlField";

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
          {/* Strategy name and company name in a separate row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <ApiKeyManager onApiKeyValidated={onApiKeyValidated} />
            </div>
          )}
          
          {/* Website URL field with crawl button using UrlField component */}
          <UrlField
            id="websiteUrl"
            name="websiteUrl"
            label="Website URL"
            value={localFormValues.websiteUrl}
            onChange={handleInputChange}
            onCrawl={() => handleCrawl("websiteUrl")}
            isCrawling={crawlingUrl === "websiteUrl"}
            crawlProgress={crawlProgress}
            showPreview={showWebsitePreview}
            setShowPreview={setShowWebsitePreview}
            previewResults={websitePreviewResults}
            crawlingUrl={crawlingUrl}
            hasApiKey={hasApiKey}
          />
          
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
          
          {/* Product URL field with crawl button using UrlField component */}
          <UrlField
            id="productUrl"
            name="productUrl"
            label="Product URL"
            value={localFormValues.productUrl}
            onChange={handleInputChange}
            onCrawl={() => handleCrawl("productUrl")}
            isCrawling={crawlingUrl === "productUrl"}
            crawlProgress={crawlProgress}
            showPreview={showProductPreview}
            setShowPreview={setShowProductPreview}
            previewResults={productPreviewResults}
            crawlingUrl={crawlingUrl}
            hasApiKey={hasApiKey}
          />
          
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
