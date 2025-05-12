
import { StrategyState } from "@/types/marketing";

/**
 * Maps URL slugs to StrategyState enum values
 */
export const slugToState: Record<string, StrategyState> = {
  'briefing': StrategyState.BRIEFING,
  'persona': StrategyState.PERSONA,
  'usp-canvas': StrategyState.PAIN_GAINS,
  'statements': StrategyState.STATEMENTS,
  'channel-strategy': StrategyState.CHANNEL_STRATEGY,
  'funnel': StrategyState.FUNNEL,
  'roas-calculator': StrategyState.ROAS_CALCULATOR,
  'ad-campaign': StrategyState.ADS,
  'completed': StrategyState.COMPLETED
};

/**
 * Maps StrategyState enum values to URL slugs
 */
export const stateToSlug: Record<StrategyState, string> = {
  [StrategyState.BRIEFING]: 'briefing',
  [StrategyState.PERSONA]: 'persona',
  [StrategyState.PAIN_GAINS]: 'usp-canvas',
  [StrategyState.STATEMENTS]: 'statements',
  [StrategyState.CHANNEL_STRATEGY]: 'channel-strategy',
  [StrategyState.FUNNEL]: 'funnel',
  [StrategyState.ROAS_CALCULATOR]: 'roas-calculator',
  [StrategyState.ADS]: 'ad-campaign',
  [StrategyState.COMPLETED]: 'completed'
};

/**
 * Get the next state in the strategy workflow
 */
export const getNextState = (currentState: StrategyState): StrategyState => {
  switch (currentState) {
    case StrategyState.BRIEFING:
      return StrategyState.PERSONA;
    case StrategyState.PERSONA:
      return StrategyState.PAIN_GAINS;
    case StrategyState.PAIN_GAINS:
      return StrategyState.STATEMENTS;
    case StrategyState.STATEMENTS:
      return StrategyState.CHANNEL_STRATEGY;
    case StrategyState.CHANNEL_STRATEGY:
      return StrategyState.FUNNEL;
    case StrategyState.FUNNEL:
      return StrategyState.ROAS_CALCULATOR;
    case StrategyState.ROAS_CALCULATOR:
      return StrategyState.ADS;
    case StrategyState.ADS:
      return StrategyState.COMPLETED;
    default:
      return StrategyState.COMPLETED;
  }
};

/**
 * Get the previous state in the strategy workflow
 */
export const getPreviousState = (currentState: StrategyState): StrategyState => {
  switch (currentState) {
    case StrategyState.PERSONA:
      return StrategyState.BRIEFING;
    case StrategyState.PAIN_GAINS:
      return StrategyState.PERSONA;
    case StrategyState.STATEMENTS:
      return StrategyState.PAIN_GAINS;
    case StrategyState.CHANNEL_STRATEGY:
      return StrategyState.STATEMENTS;
    case StrategyState.FUNNEL:
      return StrategyState.CHANNEL_STRATEGY;
    case StrategyState.ROAS_CALCULATOR:
      return StrategyState.FUNNEL;
    case StrategyState.ADS:
      return StrategyState.ROAS_CALCULATOR;
    case StrategyState.COMPLETED:
      return StrategyState.ADS;
    default:
      return StrategyState.BRIEFING;
  }
};
