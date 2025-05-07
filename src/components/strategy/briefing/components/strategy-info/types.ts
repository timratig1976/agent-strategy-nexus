
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import React from "react";

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
  source?: 'website' | 'product';
}

export interface StrategyInfoCardProps {
  formValues: any;
  saveStrategyMetadata: (updatedValues: any) => Promise<boolean>;
  showCrawler: boolean;
  setShowCrawler: (show: boolean) => void;
}
