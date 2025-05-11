
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";
import { stateToSlug } from "@/utils/strategyUrlUtils";
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import useStrategyData from "@/hooks/useStrategyData";
import { Separator } from "@/components/ui/separator";

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
          
          <Card>
            <CardHeader>
              <CardTitle>Strategy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Strategy Name</p>
                    <p className="text-base">{strategy.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="text-base capitalize">{strategy.language || "English"}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-1">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="text-base">{strategy.companyName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Website URL</p>
                    <p className="text-base">
                      {strategy.websiteUrl ? (
                        <a 
                          href={strategy.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {strategy.websiteUrl}
                        </a>
                      ) : "-"}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-1">Product Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Product Description</p>
                    <p className="text-base">{strategy.productDescription || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product URL</p>
                    <p className="text-base">
                      {strategy.productUrl ? (
                        <a 
                          href={strategy.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {strategy.productUrl}
                        </a>
                      ) : "-"}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-1">Additional Information</h4>
                <p className="text-base">{strategy.additionalInfo || "-"}</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/strategy/${id}/briefing`)}
                >
                  Edit Strategy Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StrategyOverview;
