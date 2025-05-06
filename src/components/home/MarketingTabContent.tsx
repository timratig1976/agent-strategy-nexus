
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
  PieChart,
  LineChart
} from "lucide-react";

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
    },
    {
      title: "USP Canvas Generator",
      description: "Create a unique value proposition that differentiates your business from competitors.",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      color: "border-l-amber-500",
      action: () => navigate("/create-strategy?phase=usp_canvas"),
      buttonText: !isAuthenticated ? "Sign in to Generate USP" : "Generate USP",
      buttonClass: "border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950 dark:hover:text-amber-300",
      buttonVariant: "outline" as const
    },
    {
      title: "Campaign Ideas",
      description: "Generate creative campaign concepts aligned with your brand values and target audience.",
      icon: <Target className="h-5 w-5 text-green-500" />,
      color: "border-l-green-500",
      action: () => navigate("/create-strategy?phase=campaign_ideas"),
      buttonText: !isAuthenticated ? "Sign in to Generate Ideas" : "Generate Ideas",
      buttonClass: "border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300",
      buttonVariant: "outline" as const
    }
  ];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {marketingCards.slice(0, 2).map((card, index) => (
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketingCards.slice(2, 4).map((card, index) => (
          <Card key={index} className={`border-l-4 ${card.color} shadow-sm hover:shadow-md transition-all`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {card.icon}
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-muted-foreground text-sm">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={card.action}
                variant={card.buttonVariant}
                className={`w-full h-9 px-3 py-1.5 text-sm ${card.buttonClass}`}
                disabled={dbStatus !== 'ready' || !isAuthenticated}
              >
                {card.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="h-5 w-5 text-indigo-500" />
              ROAS Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-muted-foreground text-sm">Calculate and forecast your Return On Ad Spend for various marketing channels.</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/create-strategy?phase=roas_calculator")}
              variant="outline"
              className="w-full h-9 px-3 py-1.5 text-sm border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
              disabled={dbStatus !== 'ready' || !isAuthenticated}
            >
              {!isAuthenticated ? "Sign in to Calculate ROAS" : "Calculate ROAS"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">More Marketing Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Persona Development", icon: <Users className="h-4 w-4" />, phase: "persona_development" },
            { title: "Content Strategy", icon: <PenTool className="h-4 w-4" />, phase: "content_strategy" },
            { title: "Channel Strategy", icon: <PieChart className="h-4 w-4" />, phase: "channel_strategy" },
            { title: "Ad Creative Generator", icon: <Zap className="h-4 w-4" />, phase: "ad_creative" }
          ].map((tool, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2 justify-center"
              onClick={() => navigate(`/create-strategy?phase=${tool.phase}`)}
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
