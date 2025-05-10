
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
    { title: "Persona Development", icon: <Users className="h-4 w-4" />, phase: MarketingPhase.PERSONA_DEVELOPMENT },
    { title: "Content Strategy", icon: <FileText className="h-4 w-4" />, phase: MarketingPhase.CONTENT_STRATEGY },
    { title: "Lead Magnets", icon: <Target className="h-4 w-4" />, phase: MarketingPhase.LEAD_MAGNETS },
    { title: "Ad Creative Generator", icon: <Megaphone className="h-4 w-4" />, phase: MarketingPhase.AD_CREATIVE },
    { title: "USP Generator", icon: <Zap className="h-4 w-4" />, phase: MarketingPhase.USP_GENERATOR },
    { title: "Video Ideas", icon: <Film className="h-4 w-4" />, phase: MarketingPhase.CONTENT_STRATEGY }
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
