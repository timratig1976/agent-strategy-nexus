
import { StrategyState } from "@/types/marketing";

/**
 * Get a human-readable label for a strategy state
 */
export function getStateLabel(state: string | null | undefined): string {
  if (!state) return "Unknown";
  
  const labels: Record<string, string> = {
    [StrategyState.BRIEFING]: "Briefing",
    [StrategyState.PERSONA]: "Persona Development",
    [StrategyState.PAIN_GAINS]: "Pain & Gains",
    [StrategyState.FUNNEL]: "Funnel Strategy",
    [StrategyState.ADS]: "Ad Campaign",
    [StrategyState.COMPLETED]: "Completed"
  };
  
  return labels[state] || state;
}

/**
 * Get a color class for a strategy state (Tailwind CSS classes)
 */
export function getStateColor(state: string | null | undefined): string {
  if (!state) return "bg-gray-100 text-gray-800";
  
  const colors: Record<string, string> = {
    [StrategyState.BRIEFING]: "bg-blue-100 text-blue-800",
    [StrategyState.PERSONA]: "bg-purple-100 text-purple-800",
    [StrategyState.PAIN_GAINS]: "bg-amber-100 text-amber-800",
    [StrategyState.FUNNEL]: "bg-green-100 text-green-800",
    [StrategyState.ADS]: "bg-pink-100 text-pink-800",
    [StrategyState.COMPLETED]: "bg-gray-100 text-gray-800"
  };
  
  return colors[state] || "bg-gray-100 text-gray-800";
}

/**
 * Convert StrategyState enum to string for database operations
 */
export function strategyStateToString(state: StrategyState): string {
  return state.toString();
}
