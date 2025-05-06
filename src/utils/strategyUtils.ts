
import { StrategyState } from "@/types/marketing";

// Get the state label
export const getStateLabel = (state: string): string => {
  const stateLabels: Record<StrategyState, string> = {
    briefing: "Briefing",
    persona: "Persona Development",
    pain_gains: "Pain & Gains",
    funnel: "Funnel Strategy",
    ads: "Ad Campaign"
  };
  return stateLabels[state as StrategyState] || state;
};

// Get the state color
export const getStateColor = (state: string): string => {
  const stateColors: Record<StrategyState, string> = {
    briefing: "bg-blue-100 text-blue-800",
    persona: "bg-purple-100 text-purple-800",
    pain_gains: "bg-amber-100 text-amber-800",
    funnel: "bg-green-100 text-green-800",
    ads: "bg-pink-100 text-pink-800"
  };
  return stateColors[state as StrategyState] || "bg-gray-100 text-gray-800";
};
