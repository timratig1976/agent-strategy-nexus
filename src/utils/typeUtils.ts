import { StrategyState } from "@/types/marketing";

/**
 * Type guard for StrategyState enum
 */
export function isValidStrategyState(state: any): state is StrategyState {
  return Object.values(StrategyState).includes(state as StrategyState);
}
