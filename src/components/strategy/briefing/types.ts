
import { Strategy, AgentResult } from "@/types/marketing";
import { WebsiteCrawlResult } from "@/services/firecrawl";

export interface StrategyBriefingProps {
  strategy: Strategy;
  agentResults: AgentResult[];
}

export interface BriefingHeaderProps {
  hasFinalBriefing: boolean;
  goToNextStep: () => void;
}

export interface BriefingLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export interface StrategyInfoCardProps {
  formValues: any;
  saveStrategyMetadata: (values: any) => Promise<void>;
  showCrawler: boolean;
  setShowCrawler: (show: boolean) => void;
}

export interface BriefingResultProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  progress: number;
  generateBriefing: (enhancementText?: string) => void;
  saveAgentResult: (content: string, isFinal?: boolean) => Promise<void>;
  briefingHistory: AgentResult[];
  setBriefingHistory: React.Dispatch<React.SetStateAction<AgentResult[]>>;
  onBriefingSaved?: (isFinal: boolean) => void;
  aiDebugInfo?: any;
  customTitle?: string;
  generateButtonText?: string;
  saveButtonText?: string;
  saveFinalButtonText?: string;
  placeholderText?: string;
}

export interface BriefingResultCardProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  generateBriefing: () => void;
  saveAgentResult: (content: string, isFinal?: boolean) => void;
}

export interface WebsiteCrawlerWrapperProps {
  onBack: () => void;
  crawlResults: WebsiteCrawlResult | null;
  setCrawlResults: React.Dispatch<React.SetStateAction<WebsiteCrawlResult | null>>;
}

export interface CrawlPreviewProps {
  results: WebsiteCrawlResult | null;
  show: boolean;
  source?: 'website' | 'product';
}
