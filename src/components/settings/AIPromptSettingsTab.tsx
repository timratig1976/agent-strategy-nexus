
import React from "react";
import { AIPromptSettings } from "@/components/strategy/briefing/components";

export const AIPromptSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <AIPromptSettings
        module="briefing"
        title="Strategy Briefing Prompts"
        description="Customize how the AI generates strategy briefings"
      />
      
      <AIPromptSettings
        module="persona"
        title="Persona Development Prompts"
        description="Customize how the AI creates customer personas"
      />
      
      <AIPromptSettings
        module="content_strategy"
        title="Content Strategy Prompts"
        description="Customize how the AI develops content strategies"
      />
      
      <AIPromptSettings
        module="usp_canvas_profile"
        title="USP Canvas Profile Prompts"
        description="Customize how the AI generates customer profile elements (jobs, pains, gains)"
      />
      
      <AIPromptSettings
        module="usp_canvas_value_map"
        title="USP Canvas Value Map Prompts"
        description="Customize how the AI generates value map elements (products, pain relievers, gain creators)"
      />
    </div>
  );
};

export default AIPromptSettingsTab;
