
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { StageItem } from "./stage-item";

// Define local types needed for this component
type TouchPoint = {
  id: string;
  name: string;
  channelType?: string;
};

type FunnelStage = {
  id: string;
  name: string;
  description: string;
  touchPoints: TouchPoint[];
  keyMetrics?: string[];
};

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
      description: "",
      touchPoints: [],
      keyMetrics: []
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
      name: touchpointName,
      channelType: "default"
    };
    
    const updatedStages = stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchPoints: [...(stage.touchPoints || []), newTouchpoint]
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
          touchPoints: (stage.touchPoints || []).filter(tp => tp.id !== touchpointId)
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

export default FunnelStages;
