
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketingPhase } from "@/types/marketing";
import MarketingFeatured from "./MarketingFeatured";
import StrategyCards from "./marketing/StrategyCards";
import QuickAccessTools from "./marketing/QuickAccessTools";
import { ArrowRight } from "lucide-react";

interface MarketingTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const MarketingTabContent = ({ dbStatus, isAuthenticated }: MarketingTabContentProps) => {
  const navigate = useNavigate();
  
  const handlePhaseSelect = (phase: MarketingPhase) => {
    navigate(`/create-strategy?phase=${phase}`);
  };

  const goToMarketingHub = () => {
    navigate('/marketing-hub');
  };
  
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/30 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Marketing Agent Hub</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Access our full suite of AI-powered marketing modules to build your comprehensive strategy
        </p>
        <Button 
          onClick={goToMarketingHub}
          className="group"
        >
          Access Marketing Hub
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
      <StrategyCards isAuthenticated={isAuthenticated} dbStatus={dbStatus} />
      <MarketingFeatured isAuthenticated={isAuthenticated} dbStatus={dbStatus} />
      <QuickAccessTools 
        handlePhaseSelect={handlePhaseSelect} 
        isAuthenticated={isAuthenticated} 
        dbStatus={dbStatus} 
      />
    </div>
  );
};

export default MarketingTabContent;
