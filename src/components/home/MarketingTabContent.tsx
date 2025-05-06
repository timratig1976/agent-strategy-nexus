
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  PenTool, 
  BarChart3, 
  Zap,
  Target,
  Users,
  FileText,
  Megaphone,
  Film
} from "lucide-react";
import MarketingFeatured from "./MarketingFeatured";
import { MarketingPhase } from "@/types/marketing";

interface MarketingTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const MarketingTabContent = ({ dbStatus, isAuthenticated }: MarketingTabContentProps) => {
  const navigate = useNavigate();
  
  const marketingCards = [
    {
      title: "Create a Marketing Strategy",
      description: "Build a custom marketing strategy with specialized AI agents for audience analysis, content strategy, USP development, and more.",
      icon: <PenTool className="h-5 w-5 text-blue-500" />,
      color: "border-l-blue-500",
      action: () => navigate("/create-strategy"),
      buttonText: !isAuthenticated ? "Sign in to Get Started" : "Get Started",
      buttonClass: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
      buttonVariant: "default" as const
    },
    {
      title: "View Your Strategies",
      description: "Access all your marketing strategies in one place. Review insights, track progress, and update your approach.",
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      color: "border-l-purple-500",
      action: () => navigate("/dashboard"),
      buttonText: !isAuthenticated ? "Sign in to View Dashboard" : "Go to Dashboard",
      buttonClass: "border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300",
      buttonVariant: "outline" as const
    }
  ];
  
  const handlePhaseSelect = (phase: MarketingPhase) => {
    navigate(`/create-strategy?phase=${phase}`);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {marketingCards.map((card, index) => (
          <Card key={index} className={`border-l-4 ${card.color} shadow-sm hover:shadow-md transition-all`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {card.icon}
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={card.action}
                variant={card.buttonVariant}
                className={`w-full h-10 px-4 py-2 ${card.buttonClass}`}
                disabled={dbStatus !== 'ready' || !isAuthenticated}
              >
                {card.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <MarketingFeatured isAuthenticated={isAuthenticated} dbStatus={dbStatus} />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Quick Access Tools</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { title: "Persona Development", icon: <Users className="h-4 w-4" />, phase: "persona_development" as MarketingPhase },
            { title: "Content Strategy", icon: <FileText className="h-4 w-4" />, phase: "content_strategy" as MarketingPhase },
            { title: "Lead Magnets", icon: <Target className="h-4 w-4" />, phase: "lead_magnets" as MarketingPhase },
            { title: "Ad Creative Generator", icon: <Megaphone className="h-4 w-4" />, phase: "ad_creative" as MarketingPhase },
            { title: "USP Generator", icon: <Zap className="h-4 w-4" />, phase: "usp_generator" as MarketingPhase },
            { title: "Video Ideas", icon: <Film className="h-4 w-4" />, phase: "content_strategy" as MarketingPhase }
          ].map((tool, index) => (
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
    </div>
  );
};

export default MarketingTabContent;
