
import { StrategyState } from "@/types/marketing";

// Map StrategyState to URL-friendly slugs
export const stateToSlug: Record<string, string> = {
  [StrategyState.BRIEFING]: "briefing",
  [StrategyState.PERSONA]: "persona",
  [StrategyState.PAIN_GAINS]: "usp-canvas",
  [StrategyState.STATEMENTS]: "statements",
  [StrategyState.CHANNEL_STRATEGY]: "channel-strategy",
  [StrategyState.FUNNEL]: "funnel",
  [StrategyState.ROAS_CALCULATOR]: "roas-calculator",
  [StrategyState.ADS]: "ad-campaign",
  [StrategyState.COMPLETED]: "completed",
};

// Map URL-friendly slugs to StrategyState
export const slugToState: Record<string, StrategyState> = {
  "briefing": StrategyState.BRIEFING,
  "persona": StrategyState.PERSONA,
  "usp-canvas": StrategyState.PAIN_GAINS,
  "statements": StrategyState.STATEMENTS,
  "channel-strategy": StrategyState.CHANNEL_STRATEGY,
  "funnel": StrategyState.FUNNEL,
  "roas-calculator": StrategyState.ROAS_CALCULATOR,
  "ad-campaign": StrategyState.ADS,
  "completed": StrategyState.COMPLETED,
};

// Get stage index for ordering and progression
export const getStageIndex = (state: StrategyState | string): number => {
  const stageOrder = [
    StrategyState.BRIEFING,
    StrategyState.PERSONA,
    StrategyState.PAIN_GAINS, 
    StrategyState.STATEMENTS,
    StrategyState.CHANNEL_STRATEGY,
    StrategyState.FUNNEL,
    StrategyState.ROAS_CALCULATOR,
    StrategyState.ADS,
    StrategyState.COMPLETED,
  ];
  
  return stageOrder.indexOf(state as StrategyState);
};

// Get a list of all stage slugs in order
export const getOrderedStages = (): string[] => {
  return [
    stateToSlug[StrategyState.BRIEFING],
    stateToSlug[StrategyState.PERSONA],
    stateToSlug[StrategyState.PAIN_GAINS],
    stateToSlug[StrategyState.STATEMENTS],
    stateToSlug[StrategyState.CHANNEL_STRATEGY],
    stateToSlug[StrategyState.FUNNEL],
    stateToSlug[StrategyState.ROAS_CALCULATOR],
    stateToSlug[StrategyState.ADS],
  ];
};

// Get human-readable stage names
export const getStageLabel = (slug: string): string => {
  const map: Record<string, string> = {
    "briefing": "Briefing",
    "persona": "Persona Development", 
    "usp-canvas": "USP Canvas",
    "statements": "Pain & Gain Statements",
    "channel-strategy": "Channel Strategy",
    "funnel": "Funnel Strategy",
    "roas-calculator": "ROAS Calculator",
    "ad-campaign": "Ad Campaign",
    "completed": "Completed",
  };
  
  return map[slug] || slug;
};
