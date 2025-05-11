
import { StrategyState } from "@/types/marketing";

export const stateLabels: Record<string, string> = {
  [StrategyState.BRIEFING]: "Briefing",
  [StrategyState.PERSONA]: "Persona Development",
  [StrategyState.PAIN_GAINS]: "Pain & Gains",
  [StrategyState.STATEMENTS]: "Pain & Gain Statements",
  [StrategyState.FUNNEL]: "Funnel Strategy",
  [StrategyState.ADS]: "Ad Campaign",
  [StrategyState.COMPLETED]: "Completed"
};
