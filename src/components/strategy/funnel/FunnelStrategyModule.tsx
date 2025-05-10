
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStrategyModuleProps } from "./types";
import { useFunnelData } from "./hooks/useFunnelData";
import FunnelHeader from "./components/FunnelHeader";
import FunnelFooter from "./components/FunnelFooter";
import FunnelStages from "./components/FunnelStages";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";
import { StrategyState } from "@/types/marketing";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  const strategyId = strategy?.id;
  const navigate = useNavigate();
  
  const {
    funnelData,
    isSaving,
    hasChanges,
    handleStagesChange,
    handleSave,
  } = useFunnelData(strategyId);

  // Add navigation functionality
  const { navigateToPreviousStep, isNavigating } = useStrategyNavigation({
    strategyId,
    onRefetch: () => {} // No need to refetch here as navigation will change the page
  });

  // Handler to go back to Statements stage
  const handleNavigateBack = () => {
    if (!strategyId) {
      toast.error("Strategy ID is missing");
      return;
    }
    
    console.log("Attempting to navigate back from funnel to statements");
    try {
      navigateToPreviousStep(StrategyState.FUNNEL);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate back to Pain & Gain Statements");
      
      // Fallback direct navigation if the hook fails
      navigate(`/strategy-details/${strategyId}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <FunnelHeader 
          onNavigateBack={handleNavigateBack} 
          isNavigatingBack={isNavigating}
        />
        
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Define your marketing funnel stages and touchpoints for a complete customer journey.
          </p>

          <FunnelStages
            stages={funnelData.stages}
            onStagesChange={handleStagesChange}
          />
        </CardContent>
        
        <FunnelFooter 
          hasChanges={hasChanges} 
          isSaving={isSaving} 
          onSave={handleSave}
        />
      </Card>
    </div>
  );
};

export default FunnelStrategyModule;
