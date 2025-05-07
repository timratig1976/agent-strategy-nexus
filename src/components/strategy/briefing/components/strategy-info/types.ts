
import { StrategyFormValues } from "@/components/strategy-form";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";

export interface StrategyInfoCardProps {
  formValues: StrategyFormValues & { id?: string };
  saveStrategyMetadata: (updatedValues: StrategyFormValues) => Promise<boolean>;
  showCrawler: boolean;
  setShowCrawler: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UrlFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrawl: () => Promise<void>;
  isCrawling: boolean;
  crawlProgress: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  previewResults: WebsiteCrawlResult | null;
  crawlingUrl: string | null;
}

export interface CrawlPreviewProps {
  results: WebsiteCrawlResult | null;
  show: boolean;
}
