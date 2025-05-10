
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Define local type needed for this component
type TouchPoint = {
  id: string;
  name: string;
  channelType?: string;
};

interface TouchpointsListProps {
  touchPoints: TouchPoint[];
  stageId: string;
  onRemoveTouchpoint: (stageId: string, touchpointId: string) => void;
}

const TouchpointsList: React.FC<TouchpointsListProps> = ({
  touchPoints,
  stageId,
  onRemoveTouchpoint
}) => {
  if (!touchPoints || touchPoints.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic mt-2">
        No touchpoints added yet. Add your first touchpoint below.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {touchPoints.map(touchpoint => (
        <Badge 
          key={touchpoint.id} 
          variant="outline" 
          className="flex items-center gap-1 py-1 pl-3 pr-2 bg-slate-50"
        >
          {touchpoint.name}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-1 text-muted-foreground hover:text-destructive"
            onClick={() => onRemoveTouchpoint(stageId, touchpoint.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default TouchpointsList;
