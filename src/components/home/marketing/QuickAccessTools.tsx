
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, FileText, Target, Megaphone, Zap, Film } from "lucide-react";
import { MarketingPhase } from "@/types/marketing";

interface QuickAccessToolsProps {
  handlePhaseSelect: (phase: MarketingPhase) => void;
  isAuthenticated: boolean;
  dbStatus: 'checking' | 'ready' | 'not-setup';
}

const QuickAccessTools = ({ handlePhaseSelect, isAuthenticated, dbStatus }: QuickAccessToolsProps) => {
  const tools = [
    { title: "Persona Development", icon: <Users className="h-4 w-4" />, phase: "persona_development" as MarketingPhase },
    { title: "Content Strategy", icon: <FileText className="h-4 w-4" />, phase: "content_strategy" as MarketingPhase },
    { title: "Lead Magnets", icon: <Target className="h-4 w-4" />, phase: "lead_magnets" as MarketingPhase },
    { title: "Ad Creative Generator", icon: <Megaphone className="h-4 w-4" />, phase: "ad_creative" as MarketingPhase },
    { title: "USP Generator", icon: <Zap className="h-4 w-4" />, phase: "usp_generator" as MarketingPhase },
    { title: "Video Ideas", icon: <Film className="h-4 w-4" />, phase: "content_strategy" as MarketingPhase }
  ];
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Quick Access Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tools.map((tool, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 flex flex-col items-center gap-2 justify-center"
            onClick={() => handlePhaseSelect(tool.phase)}
            disabled={dbStatus !== 'ready' || !isAuthenticated}
          >
            {tool.icon}
            <span className="text-xs">{tool.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessTools;
