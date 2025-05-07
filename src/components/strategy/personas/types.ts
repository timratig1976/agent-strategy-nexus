
import { AgentResult, Strategy } from "@/types/marketing";

export interface PersonaDevelopmentProps {
  strategy: Strategy;
  agentResults?: AgentResult[];
  briefingAgentResult?: AgentResult | null;
}
