
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FunnelStage, TouchPoint } from "../types";
import { Plus, Trash2, MoveUp, MoveDown, Plus as PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FunnelStagesProps {
  stages: FunnelStage[];
  onStagesChange: (stages: FunnelStage[]) => void;
}

const FunnelStages: React.FC<FunnelStagesProps> = ({ stages, onStagesChange }) => {
  const [newStageName, setNewStageName] = useState("");
  
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: FunnelStage = {
      id: uuidv4(),
      name: newStageName,
      touchpoints: []
    };
    
    onStagesChange([...stages, newStage]);
    setNewStageName("");
  };
  
  const handleRemoveStage = (id: string) => {
    onStagesChange(stages.filter(stage => stage.id !== id));
  };
  
  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stages.length - 1) return;
    
    const newStages = [...stages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[newIndex]] = [newStages[newIndex], newStages[index]];
    
    onStagesChange(newStages);
  };
  
  const handleAddTouchpoint = (stageId: string, touchpointName: string) => {
    if (!touchpointName.trim()) return;
    
    const newTouchpoint: TouchPoint = {
      id: uuidv4(),
      name: touchpointName
    };
    
    const updatedStages = stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchpoints: [...stage.touchpoints, newTouchpoint]
        };
      }
      return stage;
    });
    
    onStagesChange(updatedStages);
    return newTouchpoint;
  };
  
  const handleRemoveTouchpoint = (stageId: string, touchpointId: string) => {
    const updatedStages = stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchpoints: stage.touchpoints.filter(tp => tp.id !== touchpointId)
        };
      }
      return stage;
    });
    
    onStagesChange(updatedStages);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Stages & Touchpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stage List */}
          {stages.length > 0 ? (
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <StageItem 
                  key={stage.id}
                  stage={stage}
                  index={index}
                  totalStages={stages.length}
                  onRemove={handleRemoveStage}
                  onMove={handleMoveStage}
                  onAddTouchpoint={handleAddTouchpoint}
                  onRemoveTouchpoint={handleRemoveTouchpoint}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-muted-foreground">No funnel stages defined yet. Add your first stage below.</p>
            </div>
          )}

          {/* Add New Stage */}
          <div className="flex items-center space-x-2 pt-4">
            <Input
              placeholder="New stage name (e.g., Awareness, Interest, Decision)"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddStage} disabled={!newStageName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded mr-2">
            {index + 1}
          </span>
          <h3 className="font-medium text-lg">{stage.name}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onMove(index, 'down')}
            disabled={index === totalStages - 1}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onRemove(stage.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Touchpoints */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Touchpoints</label>
        {stage.touchpoints.length > 0 ? (
          <div className="space-y-2">
            {stage.touchpoints.map((touchpoint) => (
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
      
      {/* Add Touchpoint */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add touchpoint (e.g., Social Media Ad, Email Follow-up)"
          value={newTouchpointName}
          onChange={(e) => setNewTouchpointName(e.target.value)}
          className="flex-1 text-sm"
        />
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddTouchpoint}
          disabled={!newTouchpointName.trim()}
        >
          <PlusCircle className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default FunnelStages;
