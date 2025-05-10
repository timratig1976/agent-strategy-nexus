
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelStage, TouchPoint } from "../../types";
import { StageControls } from "./StageControls";
import { TouchpointsList } from "./TouchpointsList";
import { TouchpointForm } from "./TouchpointForm";

interface StageItemProps {
  stage: FunnelStage;
  index: number;
  totalStages: number;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onAddTouchpoint: (stageId: string, touchpointName: string) => TouchPoint;
  onRemoveTouchpoint: (stageId: string, touchpointId: string) => void;
}

const StageItem: React.FC<StageItemProps> = ({
  stage,
  index,
  totalStages,
  onRemove,
  onMove,
  onAddTouchpoint,
  onRemoveTouchpoint
}) => {
  const [newTouchpointName, setNewTouchpointName] = useState("");
  
  const handleAddTouchpoint = () => {
    if (newTouchpointName.trim()) {
      onAddTouchpoint(stage.id, newTouchpointName);
      setNewTouchpointName("");
    }
  };
  
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
            {index + 1}
          </span>
          <Input
            value={stage.name}
            readOnly
            className="w-auto min-w-0 bg-transparent border-none font-semibold px-0 focus-visible:ring-0"
          />
        </CardTitle>
        
        <StageControls
          stageId={stage.id}
          index={index}
          totalStages={totalStages}
          onMove={onMove}
          onRemove={onRemove}
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor={`description-${stage.id}`} className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              id={`description-${stage.id}`}
              placeholder="Stage description..."
              value={stage.description}
              readOnly
              className="resize-none"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Touchpoints
            </label>
            <TouchpointsList
              touchPoints={stage.touchPoints}
              stageId={stage.id}
              onRemoveTouchpoint={onRemoveTouchpoint}
            />
            
            <div className="mt-2">
              <TouchpointForm
                newTouchpointName={newTouchpointName}
                setNewTouchpointName={setNewTouchpointName}
                handleAddTouchpoint={handleAddTouchpoint}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StageItem;
