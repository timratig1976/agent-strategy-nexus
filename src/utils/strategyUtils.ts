

import { StrategyState } from "@/types/marketing";

/**
 * Get a human-readable label for a strategy state
 */
export const getStateLabel = (state: string): string => {
  switch (state) {
    case StrategyState.BRIEFING:
      return "Briefing";
    case StrategyState.PERSONA:
      return "Persona Development";
    case StrategyState.PAIN_GAINS:
      return "USP Canvas";
    case StrategyState.STATEMENTS:
      return "Pain & Gain Statements";
    case StrategyState.CHANNEL_STRATEGY:
      return "Channel Strategy";
    case StrategyState.FUNNEL:
      return "Funnel Strategy";
    case StrategyState.ROAS_CALCULATOR:
      return "ROAS Calculator";
    case StrategyState.ADS:
      return "Ad Campaign";
    default:
      return state;
  }
};

/**
 * Get a color for a strategy state tag
 */
export const getStateColor = (state: string): string => {
  switch (state) {
    case StrategyState.BRIEFING:
      return "bg-blue-100 text-blue-800";
    case StrategyState.PERSONA:
      return "bg-purple-100 text-purple-800";
    case StrategyState.PAIN_GAINS:
      return "bg-green-100 text-green-800";
    case StrategyState.STATEMENTS:
      return "bg-amber-100 text-amber-800";
    case StrategyState.CHANNEL_STRATEGY:
      return "bg-indigo-100 text-indigo-800";
    case StrategyState.FUNNEL:
      return "bg-orange-100 text-orange-800";
    case StrategyState.ROAS_CALCULATOR:
      return "bg-cyan-100 text-cyan-800";
    case StrategyState.ADS:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Maps StrategyState enum values to valid database strings
 * This is needed because the database enum type doesn't include all TS enum values
 */
export const stateToDbMap: Record<StrategyState, string> = {
  [StrategyState.BRIEFING]: "briefing",
  [StrategyState.PERSONA]: "persona",
  [StrategyState.PAIN_GAINS]: "pain_gains",
  [StrategyState.STATEMENTS]: "pain_gains", // Map to pain_gains in DB since statements isn't in DB enum
  [StrategyState.CHANNEL_STRATEGY]: "channel_strategy", // New mapping
  [StrategyState.FUNNEL]: "funnel",
  [StrategyState.ROAS_CALCULATOR]: "roas_calculator", // New mapping
  [StrategyState.ADS]: "ads",
  [StrategyState.COMPLETED]: "ads" // Map to ads in DB since completed isn't in DB enum
};

