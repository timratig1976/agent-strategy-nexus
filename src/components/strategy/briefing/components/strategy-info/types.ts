
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import React from "react";
import { CrawlUrlType } from "./hooks/useCrawlUrl";

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

export interface StrategyFormProps {
  localFormValues: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  crawlingUrl: string | null;
  handleCrawl: (urlType: CrawlUrlType) => Promise<any>; // Updated return type to be more flexible
  crawlProgress: number;
  websitePreviewResults: WebsiteCrawlResult | null;
  productPreviewResults: WebsiteCrawlResult | null;
  showWebsitePreview: boolean;
  showProductPreview: boolean;
  setShowWebsitePreview: (show: boolean) => void;
  setShowProductPreview: (show: boolean) => void;
}
