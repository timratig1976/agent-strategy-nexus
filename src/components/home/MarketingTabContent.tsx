
import React from "react";
import { useNavigate } from "react-router-dom";
import { MarketingPhase } from "@/types/marketing";
import MarketingFeatured from "./MarketingFeatured";
import StrategyCards from "./marketing/StrategyCards";
import QuickAccessTools from "./marketing/QuickAccessTools";

interface MarketingTabContentProps {
  dbStatus: 'checking' | 'ready' | 'not-setup';
  isAuthenticated: boolean;
}

const MarketingTabContent = ({ dbStatus, isAuthenticated }: MarketingTabContentProps) => {
  const navigate = useNavigate();
  
  const handlePhaseSelect = (phase: MarketingPhase) => {
    navigate(`/create-strategy?phase=${phase}`);
  };
  
  return (
    <div className="space-y-8">
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
