
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";

export interface StrategyBriefingProps {
  strategy: {
    id: string;
    name: string;
    description?: string;
    state?: string;
  };
  agentResults?: AgentResult[];
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
  saveAgentResult: (result: AgentResult) => Promise<boolean>;
}

export interface WebsiteCrawlerWrapperProps {
  onBack: () => void;
  crawlResults: WebsiteCrawlResult | null;
  setCrawlResults: (results: WebsiteCrawlResult | null) => void;
}
