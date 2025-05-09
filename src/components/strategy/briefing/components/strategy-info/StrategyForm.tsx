
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrategyFormProps } from "./types";
import UrlField from "./UrlField";
import ApiKeyManager from "@/components/marketing/modules/website-crawler/ApiKeyManager";

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
  onApiKeyValidated,
  crawlStatus // Add crawl status prop
}) => {
  const [showApiKeyManager, setShowApiKeyManager] = React.useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {showApiKeyManager ? (
        <div className="mb-6">
          <ApiKeyManager 
            onApiKeyValidated={() => {
              onApiKeyValidated();
              setShowApiKeyManager(false);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyManager(false)}
            className="mt-2"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyManager(true)}
          >
            Set FireCrawl API Key
          </Button>
        </div>
      )}
      
      <div className="grid gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-1">
            Company Name
          </label>
          <Input
            id="companyName"
            name="companyName"
            value={localFormValues.companyName || ''}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </div>

        <UrlField
          id="websiteUrl"
          name="websiteUrl"
          label="Website URL"
          value={localFormValues.websiteUrl || ''}
          onChange={handleInputChange}
          onCrawl={() => handleCrawl('websiteUrl')}
          isCrawling={crawlingUrl === 'websiteUrl'}
          crawlProgress={crawlProgress}
          showPreview={showWebsitePreview}
          setShowPreview={setShowWebsitePreview}
          previewResults={websitePreviewResults}
          crawlingUrl={crawlingUrl}
          hasApiKey={hasApiKey}
          crawlStatus={crawlStatus} // Pass the crawl status
        />

        <UrlField
          id="productUrl"
          name="productUrl"
          label="Product URL (optional)"
          value={localFormValues.productUrl || ''}
          onChange={handleInputChange}
          onCrawl={() => handleCrawl('productUrl')}
          isCrawling={crawlingUrl === 'productUrl'}
          crawlProgress={crawlProgress}
          showPreview={showProductPreview}
          setShowPreview={setShowProductPreview}
          previewResults={productPreviewResults}
          crawlingUrl={crawlingUrl}
          hasApiKey={hasApiKey}
          crawlStatus={crawlStatus} // Pass the crawl status
        />

        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium mb-1">
            Product/Service Description
          </label>
          <Textarea
            id="productDescription"
            name="productDescription"
            value={localFormValues.productDescription || ''}
            onChange={handleInputChange}
            placeholder="Describe your product or service"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">
            Additional Information (optional)
          </label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={localFormValues.additionalInfo || ''}
            onChange={handleInputChange}
            placeholder="Add any other relevant information about your business or marketing goals"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Information'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StrategyForm;
