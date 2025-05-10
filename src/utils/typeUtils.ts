
import { StrategyState, MarketingPhase } from "@/types/marketing";
import { Json } from "@/integrations/supabase/types";

/**
 * Type guard to check if a value is a valid StrategyState
 */
export function isValidStrategyState(value: string): value is StrategyState {
  return Object.values(StrategyState).includes(value as StrategyState);
}

/**
 * Type guard to check if a value is a valid MarketingPhase
 */
export function isValidMarketingPhase(value: string): value is MarketingPhase {
  return Object.values(MarketingPhase).includes(value as MarketingPhase);
}

/**
 * Safely converts a string to StrategyState enum
 */
export function toStrategyState(value: string | null | undefined): StrategyState {
  if (value && isValidStrategyState(value)) {
    return value as StrategyState;
  }
  return StrategyState.BRIEFING; // Default value
}

/**
 * Safely converts a string to MarketingPhase enum
 */
export function toMarketingPhase(value: string | null | undefined): MarketingPhase {
  if (value && isValidMarketingPhase(value)) {
    return value as MarketingPhase;
  }
  return MarketingPhase.BRIEFING; // Default value
}

/**
 * Safely access a property in a Json object
 */
export function safeJsonAccess<T>(json: Json | undefined | null, key: string, defaultValue: T): T {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return defaultValue;
  }
  
  const typedJson = json as Record<string, any>;
  return (key in typedJson && typedJson[key] !== null) ? typedJson[key] as T : defaultValue;
}

/**
 * Convert StrategyState enum to string for database operations
 */
export function strategyStateToString(state: StrategyState): string {
  return state.toString();
}

/**
 * Safe conversion from JSON to a Record type
 */
export function safeJsonToRecord(json: Json | null | undefined): Record<string, any> {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return {};
  }
  return json as Record<string, any>;
}
