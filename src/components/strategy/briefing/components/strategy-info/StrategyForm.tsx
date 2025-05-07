
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { StrategyFormValues } from "@/components/strategy-form";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import UrlField from "./UrlField";

interface StrategyFormProps {
  localFormValues: StrategyFormValues & { id?: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (urlType: 'websiteUrl' | 'productUrl') => Promise<void>;
  crawlProgress: number;
  previewResults: WebsiteCrawlResult | null;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

const StrategyForm: React.FC<StrategyFormProps> = ({
  localFormValues,
  handleInputChange,
  handleSubmit,
  isSaving,
  crawlingUrl,
  handleCrawl,
  crawlProgress,
  previewResults,
  showPreview,
  setShowPreview
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
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
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        previewResults={previewResults}
        crawlingUrl={crawlingUrl}
      />
      
      <div className="space-y-2">
        <Label htmlFor="productDescription">Product Description</Label>
        <Textarea 
          id="productDescription"
          name="productDescription"
          value={localFormValues.productDescription || ''}
          onChange={handleInputChange}
          placeholder="Describe your product or service"
          rows={3}
        />
      </div>
      
      <UrlField
        id="productUrl"
        name="productUrl"
        label="Product URL"
        value={localFormValues.productUrl || ''}
        onChange={handleInputChange}
        onCrawl={() => handleCrawl('productUrl')}
        isCrawling={crawlingUrl === 'productUrl'}
        crawlProgress={crawlProgress}
        showPreview={false}
        setShowPreview={() => {}}
        previewResults={null}
        crawlingUrl={crawlingUrl}
      />
      
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea 
          id="additionalInfo"
          name="additionalInfo"
          value={localFormValues.additionalInfo || ''}
          onChange={handleInputChange}
          placeholder="Any other relevant information"
          rows={3}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full flex items-center gap-2"
        disabled={isSaving || crawlingUrl !== null}
      >
        {isSaving ? (
          <>Saving...</>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Information
          </>
        )}
      </Button>
    </form>
  );
};

export default StrategyForm;
