
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
    case StrategyState.FUNNEL:
      return "Funnel Strategy";
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
    case StrategyState.FUNNEL:
      return "bg-orange-100 text-orange-800";
    case StrategyState.ADS:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
