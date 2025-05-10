
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FunnelStage, TouchPoint } from "../../types";
import { Trash2, Plus as PlusCircle } from "lucide-react";

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
    if (!newTouchpointName.trim()) return;
    
    onAddTouchpoint(stage.id, newTouchpointName);
    setNewTouchpointName("");
  };
  
  return (
    <div className="border rounded-lg p-4">
      <StageHeader 
        stage={stage} 
        index={index} 
        totalStages={totalStages}
        onMove={onMove}
        onRemove={onRemove}
      />
      
      <TouchpointsList 
        stage={stage} 
        onRemoveTouchpoint={onRemoveTouchpoint} 
      />
      
      <TouchpointForm
        newTouchpointName={newTouchpointName}
        setNewTouchpointName={setNewTouchpointName}
        handleAddTouchpoint={handleAddTouchpoint}
      />
    </div>
  );
};

interface StageHeaderProps {
  stage: FunnelStage;
  index: number;
  totalStages: number;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const StageHeader: React.FC<StageHeaderProps> = ({ stage, index, totalStages, onRemove, onMove }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <span className="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded mr-2">
          {index + 1}
        </span>
        <h3 className="font-medium text-lg">{stage.name}</h3>
      </div>
      <StageControls
        stageId={stage.id}
        index={index}
        totalStages={totalStages}
        onMove={onMove}
        onRemove={onRemove}
      />
    </div>
  );
};

export default StageItem;
