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
 * Updated to correctly map to the actual database strategy_state enum values
 * which now includes: 'briefing', 'persona', 'pain_gains', 'funnel', 'ads', 
 * 'statements', 'channel_strategy', 'roas_calculator'
 */
export const stateToDbMap: Record<StrategyState, string> = {
  [StrategyState.BRIEFING]: "briefing",
  [StrategyState.PERSONA]: "persona",
  [StrategyState.PAIN_GAINS]: "pain_gains",
  [StrategyState.STATEMENTS]: "statements", // Mapped to exact database enum value
  [StrategyState.CHANNEL_STRATEGY]: "channel_strategy", // Mapped to exact database enum value
  [StrategyState.FUNNEL]: "funnel",
  [StrategyState.ROAS_CALCULATOR]: "roas_calculator", // Mapped to exact database enum value
  [StrategyState.ADS]: "ads",
  [StrategyState.COMPLETED]: "completed" // Updated to map to 'completed' if it exists in the DB enum
};

