
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { StrategyFormValues } from "@/components/strategy-form";

export interface StrategyInfoCardProps {
  formValues: StrategyFormValues & { id?: string };
  saveStrategyMetadata: (values: any) => Promise<void>;
  showCrawler: boolean;
  setShowCrawler: (show: boolean) => void;
}

export interface UrlFieldProps {
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
  previewResults: WebsiteCrawlResult | null;
  crawlingUrl: string | null;
  hasApiKey: boolean;
  crawlStatus?: string;
}
