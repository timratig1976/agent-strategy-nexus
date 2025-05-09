
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";
import { CrawlUrlType } from "./hooks/useCrawlUrl";

export interface StrategyInfoCardProps {
  formValues: StrategyFormValues & { id?: string };
  saveStrategyMetadata: (values: any) => Promise<void>;
  showCrawler: boolean;
  setShowCrawler: (show: boolean) => void;
}

export interface StrategyFormProps {
  localFormValues: StrategyFormValues & { id?: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (urlType: CrawlUrlType) => Promise<any>;
  crawlProgress: number;
  websitePreviewResults: WebsiteCrawlResult | null;
  productPreviewResults: WebsiteCrawlResult | null;
  showWebsitePreview: boolean;
  showProductPreview: boolean;
  setShowWebsitePreview: (show: boolean) => void;
  setShowProductPreview: (show: boolean) => void;
  hasApiKey: boolean;
  onApiKeyValidated: () => void;
  crawlStatus?: string; // Add crawl status prop
}

export interface UrlFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrawl: () => Promise<any>;
  isCrawling: boolean;
  crawlProgress: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  previewResults: WebsiteCrawlResult | null;
  crawlingUrl: string | null;
  hasApiKey: boolean;
  crawlStatus?: string; // Add crawl status prop
}

export interface CrawlPreviewProps {
  results: WebsiteCrawlResult;
  show: boolean;
  source?: 'website' | 'product';
}
