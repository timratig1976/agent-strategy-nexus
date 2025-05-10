
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FunnelTouchpoint } from "../../types";

interface TouchpointsListProps {
  touchpoints: FunnelTouchpoint[];
  onRemove: (id: string) => void;
}

export const TouchpointsList: React.FC<TouchpointsListProps> = ({
  touchpoints,
  onRemove
}) => {
  if (touchpoints.length === 0) {
    return (
      <div className="text-sm text-muted-foreground mb-2">
        No touchpoints added yet. Add your first touchpoint to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      <h4 className="text-sm font-medium mb-1">Touchpoints:</h4>
      <ul className="space-y-1">
        {touchpoints.map(touchpoint => (
          <li key={touchpoint.id} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
            <span className="text-sm">{touchpoint.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onRemove(touchpoint.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove touchpoint</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouchpointsList;
