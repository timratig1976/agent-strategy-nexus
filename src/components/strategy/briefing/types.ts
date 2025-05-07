
import { AgentResult } from "@/types/marketing";
import { StrategyFormValues } from "@/components/strategy-form";

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
  saveAgentResult: (result: AgentResult) => Promise<boolean>;
  briefingHistory: AgentResult[];
  setBriefingHistory: (history: AgentResult[] | ((prev: AgentResult[]) => AgentResult[])) => void;
  onBriefingSaved?: (isFinal: boolean) => void;
  aiDebugInfo?: any;
}

export interface BriefingResultCardProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  generateBriefing: () => void;
  saveAgentResult: (result: AgentResult) => Promise<boolean>;
}
