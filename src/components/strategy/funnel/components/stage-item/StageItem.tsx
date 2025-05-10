
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FunnelStage } from "../../types";
import { TouchpointsList } from "./TouchpointsList";
import { TouchpointForm } from "./TouchpointForm";
import { StageControls } from "./StageControls";

interface StageItemProps {
  stage: FunnelStage;
  index: number;
  totalStages: number;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onAddTouchpoint: (stageId: string, name: string) => any;
  onRemoveTouchpoint: (stageId: string, touchpointId: string) => void;
}

export const StageItem: React.FC<StageItemProps> = ({
  stage,
  index,
  totalStages,
  onRemove,
  onMove,
  onAddTouchpoint,
  onRemoveTouchpoint
}) => {
  const [isAddingTouchpoint, setIsAddingTouchpoint] = useState(false);
  const [newTouchpointName, setNewTouchpointName] = useState("");
  
  const handleAddTouchpoint = () => {
    if (!newTouchpointName.trim()) return;
    
    onAddTouchpoint(stage.id, newTouchpointName);
    setNewTouchpointName("");
    setIsAddingTouchpoint(false);
  };
  
  return (
    <Card className="border-l-4" style={{ borderLeftColor: getStageColor(index) }}>
      <CardHeader className="py-3 px-4 flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">{stage.name}</h3>
          <span className="text-xs text-muted-foreground">
            Stage {index + 1} • {stage.touchPoints?.length || 0} touchpoints
          </span>
        </div>
        
        <StageControls 
          index={index}
          totalStages={totalStages}
          onMove={(direction) => onMove(index, direction)}
          onRemove={() => onRemove(stage.id)}
        />
      </CardHeader>
      
      <CardContent className="py-3 px-4">
        {/* Touchpoints List */}
        <TouchpointsList 
          touchpoints={stage.touchPoints || []} 
          onRemove={(id) => onRemoveTouchpoint(stage.id, id)}
        />
        
        {/* Add Touchpoint Form */}
        {isAddingTouchpoint ? (
          <TouchpointForm 
            value={newTouchpointName}
            onChange={setNewTouchpointName}
            onAdd={handleAddTouchpoint}
            onCancel={() => {
              setIsAddingTouchpoint(false);
              setNewTouchpointName("");
            }}
          />
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsAddingTouchpoint(true)}
          >
            Add Touchpoint
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get a color for the stage based on its index
const getStageColor = (index: number): string => {
  const colors = [
    '#3b82f6', // blue-500
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#f43f5e', // rose-500
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#f59e0b', // amber-500
  ];
  
  return colors[index % colors.length];
};
