import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";
import { stateToSlug } from "@/utils/strategyUrlUtils";
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import useStrategyData from "@/hooks/useStrategyData";

const StrategyOverview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { strategy, isLoading } = useStrategyData({ id });
  
  // Navigate to continue working on strategy
  const handleContinueStrategy = () => {
    if (strategy && strategy.state) {
      const stateSlug = stateToSlug[strategy.state] || "briefing";
      navigate(`/strategy/${id}/${stateSlug}`);
    }
  };
  
  if (isLoading) {
    return <LoadingStrategy />;
  }
  
  if (!strategy) {
    return <StrategyNotFound />;
  }
  
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <StrategyBackButton />
        
        <StrategyHeader 
          strategy={strategy}
          getStateLabel={getStateLabel}
          getStateColor={getStateColor}
        />
        
        <div className="mt-6 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Strategy Overview</h3>
                  <p className="text-muted-foreground">{strategy.description}</p>
                </div>
                
                <Button 
                  onClick={handleContinueStrategy} 
                  className="sm:w-auto w-full flex items-center gap-2"
                >
                  Continue Strategy
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* You can add more sections here for strategy overview */}
        </div>
      </div>
    </>
  );
};

export default StrategyOverview;
