
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
  [StrategyState.STATEMENTS]: "statements",
  [StrategyState.CHANNEL_STRATEGY]: "channel_strategy",
  [StrategyState.FUNNEL]: "funnel",
  [StrategyState.ROAS_CALCULATOR]: "roas_calculator",
  [StrategyState.ADS]: "ads",
  [StrategyState.COMPLETED]: "ads" // Map COMPLETED to 'ads' since the database doesn't have a 'completed' state
};

/**
 * Get a valid database enum value for strategy_state
 * This ensures we never try to write an invalid enum value to the database
 */
export const getValidDbState = (state: StrategyState): "briefing" | "persona" | "pain_gains" | 
                                                     "statements" | "channel_strategy" | "funnel" | 
                                                     "roas_calculator" | "ads" => {
  const dbValue = stateToDbMap[state];
  
  // Ensure we're returning a valid database enum value
  switch (dbValue) {
    case "briefing": 
    case "persona": 
    case "pain_gains": 
    case "statements":
    case "channel_strategy":
    case "funnel":
    case "roas_calculator":
    case "ads":
      return dbValue;
    default:
      console.warn(`Invalid state value: ${state}, falling back to "ads"`);
      return "ads"; // Default fallback for safety
  }
};
