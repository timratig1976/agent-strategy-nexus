
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStrategyModuleProps } from "./types";
import { useFunnelData } from "./hooks/useFunnelData";
import FunnelHeader from "./components/FunnelHeader";
import FunnelFooter from "./components/FunnelFooter";
import FunnelStages from "./components/FunnelStages";

const FunnelStrategyModule: React.FC<FunnelStrategyModuleProps> = ({ strategy }) => {
  const strategyId = strategy?.id;
  
  const {
    funnelData,
    isSaving,
    hasChanges,
    handleStagesChange,
    handleSave,
  } = useFunnelData(strategyId);

  return (
    <div className="space-y-6">
      <Card>
        <FunnelHeader />
        
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
