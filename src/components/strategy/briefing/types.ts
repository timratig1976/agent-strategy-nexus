
import { StrategyFormValues } from "@/components/strategy-form";
import { AgentResult, Strategy } from "@/types/marketing";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";

export interface StrategyBriefingProps {
  strategy: Strategy;
  agentResults: AgentResult[];
}

export interface StrategyMetadata {
  id?: string;
  strategy_id?: string;
  company_name: string;
  website_url: string;
  product_description: string;
  product_url: string;
  additional_info: string;
  created_at?: string;
  updated_at?: string;
}

export type StrategyMetadataRow = {
  id: string;
  strategy_id: string;
  company_name: string | null;
  website_url: string | null;
  product_description: string | null;
  product_url: string | null;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
};

export type GetStrategyMetadataParams = {
  strategy_id_param: string;
};

export type UpsertStrategyMetadataParams = {
  strategy_id_param: string;
  company_name_param: string;
  website_url_param: string;
  product_description_param: string;
  product_url_param: string;
  additional_info_param: string;
};

export interface StrategyInfoCardProps {
  formValues: StrategyFormValues;
  saveStrategyMetadata: (updatedValues: StrategyFormValues) => Promise<boolean>;
  showCrawler: boolean;
  setShowCrawler: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BriefingResultCardProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  generateBriefing: () => Promise<void>;
  saveAgentResult: (updatedResult: AgentResult) => Promise<boolean>;
}

export interface WebsiteCrawlerWrapperProps {
  onBack: () => void;
  crawlResults?: WebsiteCrawlResult;
  setCrawlResults?: React.Dispatch<React.SetStateAction<WebsiteCrawlResult | undefined>>;
}

export interface CrawlPreviewProps {
  results: WebsiteCrawlResult;
  isOpen: boolean;
}
