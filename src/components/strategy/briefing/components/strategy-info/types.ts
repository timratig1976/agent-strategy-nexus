import { WebsiteCrawlResult } from "@/services/FirecrawlService";

export interface CrawlPreviewProps {
  results: WebsiteCrawlResult;
  show: boolean;
  source?: 'website' | 'product';
}

export interface UrlFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrawl: () => Promise<void>;
  isCrawling: boolean;
  crawlProgress: number;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  previewResults: WebsiteCrawlResult | null;
  crawlingUrl: string | null;
  hasApiKey: boolean;
}

export interface StrategyFormProps {
  localFormValues: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (urlType: 'websiteUrl' | 'productUrl') => Promise<any>;
  crawlProgress: number;
  websitePreviewResults: WebsiteCrawlResult | null;
  productPreviewResults: WebsiteCrawlResult | null;
  showWebsitePreview: boolean;
  showProductPreview: boolean;
  setShowWebsitePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProductPreview: React.Dispatch<React.SetStateAction<boolean>>;
  hasApiKey: boolean;
  onApiKeyValidated: () => void;
}

export interface StrategyInfoCardProps {
  formValues: any;
  saveStrategyMetadata: (values: any) => Promise<void>;
  showCrawler: boolean;
  setShowCrawler: React.Dispatch<React.SetStateAction<boolean>>;
}
