
import { ReactNode } from "react";
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";

export interface StrategyBriefingProps {
  strategy: any;
  agentResults?: AgentResult[];
}

export interface BriefingHeaderProps {
  hasFinalBriefing: boolean;
  goToNextStep: () => void;
}

export interface BriefingLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export interface BriefingResultCardProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  generateBriefing: () => void;
  saveAgentResult: (content: string) => Promise<void>;
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
  error?: string | null;
  customTitle?: string;
  generateButtonText?: string;
  saveButtonText?: string;
  saveFinalButtonText?: string;
  placeholderText?: string;
}

export interface EnhancerProps {
  enhancementText: string;
  setEnhancementText: (text: string) => void;
}

export interface StrategyInfoCardProps {
  formValues: StrategyFormValues;
  saveStrategyMetadata: (values: StrategyFormValues) => Promise<void>;
  showCrawler: boolean;
  setShowCrawler: (show: boolean) => void;
}

export interface WebsiteCrawlerWrapperProps {
  onBack: () => void;
  crawlResults: any | null;
  setCrawlResults: (results: any | null) => void;
}
