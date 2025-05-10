
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowDown } from "lucide-react";

interface TouchPoint {
  id: string;
  name: string;
}

interface FunnelStage {
  id: string;
  name: string;
  touchpoints: TouchPoint[];
}

interface FunnelStagesProps {
  stages: FunnelStage[];
  onStagesChange: (stages: FunnelStage[]) => void;
}

const FunnelStages: React.FC<FunnelStagesProps> = ({ stages, onStagesChange }) => {
  const [newStageName, setNewStageName] = useState("");
  const [newTouchpointNames, setNewTouchpointNames] = useState<Record<string, string>>({});

  // Add new funnel stage
  const handleAddStage = () => {
    if (!newStageName.trim()) return;

    const newStage: FunnelStage = {
      id: crypto.randomUUID(),
      name: newStageName,
      touchpoints: [],
    };

    onStagesChange([...stages, newStage]);
    setNewStageName("");
  };

  // Remove a funnel stage
  const handleRemoveStage = (stageId: string) => {
    onStagesChange(stages.filter((stage) => stage.id !== stageId));
  };

  // Add a touchpoint to a stage
  const handleAddTouchpoint = (stageId: string) => {
    const touchpointName = newTouchpointNames[stageId];
    if (!touchpointName?.trim()) return;

    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchpoints: [
            ...stage.touchpoints,
            { id: crypto.randomUUID(), name: touchpointName },
          ],
        };
      }
      return stage;
    });

    onStagesChange(updatedStages);

    // Clear the input for this stage
    setNewTouchpointNames({
      ...newTouchpointNames,
      [stageId]: "",
    });
  };

  // Remove a touchpoint
  const handleRemoveTouchpoint = (stageId: string, touchpointId: string) => {
    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchpoints: stage.touchpoints.filter((tp) => tp.id !== touchpointId),
        };
      }
      return stage;
    });

    onStagesChange(updatedStages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Stages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stage list */}
        {stages.map((stage, index) => (
          <div key={stage.id} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{stage.name}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveStage(stage.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Touchpoints */}
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Touchpoints</h4>
              {stage.touchpoints.length === 0 ? (
                <p className="text-sm text-muted-foreground">No touchpoints added yet.</p>
              ) : (
                <ul className="space-y-1">
                  {stage.touchpoints.map((tp) => (
                    <li 
                      key={tp.id} 
                      className="flex justify-between items-center py-1 px-2 bg-muted/50 rounded-sm"
                    >
                      <span>{tp.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveTouchpoint(stage.id, tp.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add touchpoint input */}
            <div className="flex gap-2">
              <Input 
                placeholder="Add touchpoint" 
                value={newTouchpointNames[stage.id] || ""}
                onChange={(e) => 
                  setNewTouchpointNames({
                    ...newTouchpointNames,
                    [stage.id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTouchpoint(stage.id);
                  }
                }}
              />
              <Button 
                variant="outline" 
                onClick={() => handleAddTouchpoint(stage.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Arrow connecting to next stage */}
            {index < stages.length - 1 && (
              <div className="flex justify-center my-4">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Add new stage input */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Add new funnel stage"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddStage();
              }
            }}
          />
          <Button onClick={handleAddStage}>
            <Plus className="h-4 w-4 mr-2" /> Add Stage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelStages;
