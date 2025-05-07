
import { AgentResult, Strategy } from "@/types/marketing";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";

export interface StrategyBriefingProps {
  strategy: Strategy;
  agentResults?: AgentResult[];
}

export interface WebsiteCrawlerWrapperProps {
  onBack: () => void;
  crawlResults?: WebsiteCrawlResult;
  setCrawlResults: (results?: WebsiteCrawlResult) => void;
}
