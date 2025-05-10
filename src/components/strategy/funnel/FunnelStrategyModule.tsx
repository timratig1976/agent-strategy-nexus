
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStrategyModuleProps } from "./types";
import { useFunnelData } from "./hooks/useFunnelData";
import FunnelHeader from "./components/FunnelHeader";
import FunnelFooter from "./components/FunnelFooter";
import FunnelStages from "./components/FunnelStages";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  const strategyId = strategy?.id;
  
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

  // Handler to go back to USP Canvas (pain_gains) stage
  const handleNavigateBack = () => {
    if (strategyId) {
      navigateToPreviousStep('funnel');
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
