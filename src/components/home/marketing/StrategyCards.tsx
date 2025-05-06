
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategyCardsProps {
  isAuthenticated: boolean;
  dbStatus: 'checking' | 'ready' | 'not-setup';
}

const StrategyCards = ({ isAuthenticated, dbStatus }: StrategyCardsProps) => {
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

  return (
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
  );
};

export default StrategyCards;
