
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FunnelStage } from "../../types";

interface TouchpointsListProps {
  stage: FunnelStage;
  onRemoveTouchpoint: (stageId: string, touchpointId: string) => void;
}

const TouchpointsList: React.FC<TouchpointsListProps> = ({ stage, onRemoveTouchpoint }) => {
  return (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-medium">Touchpoints</label>
      {stage.touchPoints && stage.touchPoints.length > 0 ? (
        <div className="space-y-2">
          {stage.touchPoints.map((touchpoint) => (
            <div key={touchpoint.id} className="flex items-center justify-between bg-muted p-2 rounded">
              <span>{touchpoint.name}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onRemoveTouchpoint(stage.id, touchpoint.id)}
                className="h-6 w-6 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
          No touchpoints added yet
        </div>
      )}
    </div>
  );
};

export default TouchpointsList;
