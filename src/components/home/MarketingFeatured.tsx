
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  BarChart3, 
  Target,
  Users,
  PieChart,
  LineChart,
  Globe
} from "lucide-react";
import { MarketingPhase } from "@/types/marketing";

interface FeaturedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  phase: MarketingPhase;
  color: string;
  isAuthenticated: boolean;
  onClick: (phase: MarketingPhase) => void;
}

const FeaturedCard = ({ title, description, icon, phase, color, isAuthenticated, onClick }: FeaturedCardProps) => {
  return (
    <Card className={`border-l-4 ${color} shadow-sm hover:shadow-md transition-all h-full flex flex-col`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          onClick={() => onClick(phase)}
          variant="outline"
          className={`w-full h-9 px-3 py-1.5 text-sm border-${color.split('-')[2]}-200 hover:bg-${color.split('-')[2]}-50 hover:text-${color.split('-')[2]}-700`}
          disabled={!isAuthenticated}
        >
          {!isAuthenticated ? "Sign in to Access" : "Start Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface MarketingFeaturedProps {
  isAuthenticated: boolean;
  dbStatus: 'checking' | 'ready' | 'not-setup';
}

const MarketingFeatured = ({ isAuthenticated, dbStatus }: MarketingFeaturedProps) => {
  const navigate = useNavigate();
  
  const handlePhaseSelect = (phase: MarketingPhase) => {
    navigate(`/create-strategy?phase=${phase}`);
  };
  
  const featuredPhases = [
    {
      title: "Website Analysis",
      description: "Analyze your website's performance, SEO, and user experience to inform your marketing strategy.",
      icon: <Globe className="h-5 w-5 text-amber-500" />,
      color: "border-l-amber-500",
      phase: MarketingPhase.WEBSITE_ANALYSIS
    },
    {
      title: "Persona Development",
      description: "Create detailed buyer personas to understand your target audience better.",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      color: "border-l-purple-500",
      phase: MarketingPhase.PERSONA_DEVELOPMENT
    },
    {
      title: "USP Canvas",
      description: "Develop a unique selling proposition that differentiates your business from competitors.",
      icon: <Sparkles className="h-5 w-5 text-green-500" />,
      color: "border-l-green-500",
      phase: MarketingPhase.USP_CANVAS
    },
    {
      title: "Channel Strategy",
      description: "Determine the optimal mix of marketing channels based on your audience and objectives.",
      icon: <PieChart className="h-5 w-5 text-orange-500" />,
      color: "border-l-orange-500", 
      phase: MarketingPhase.CHANNEL_STRATEGY
    },
    {
      title: "ROAS Calculator",
      description: "Calculate and forecast your Return On Ad Spend for various marketing channels.",
      icon: <LineChart className="h-5 w-5 text-indigo-500" />,
      color: "border-l-indigo-500",
      phase: MarketingPhase.ROAS_CALCULATOR
    },
    {
      title: "Campaign Ideas",
      description: "Generate creative campaign concepts aligned with your brand values and target audience.",
      icon: <Target className="h-5 w-5 text-pink-500" />,
      color: "border-l-pink-500",
      phase: MarketingPhase.CAMPAIGN_IDEAS
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Featured Marketing Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredPhases.map((phase, index) => (
          <FeaturedCard
            key={index}
            title={phase.title}
            description={phase.description}
            icon={phase.icon}
            phase={phase.phase}
            color={phase.color}
            isAuthenticated={isAuthenticated && dbStatus === 'ready'}
            onClick={handlePhaseSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketingFeatured;
