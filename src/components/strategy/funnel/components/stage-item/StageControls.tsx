
import React from "react";
import { Button } from "@/components/ui/button";
import { MoveUp, MoveDown, Trash2 } from "lucide-react";

interface StageControlsProps {
  stageId: string;
  index: number;
  totalStages: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onRemove: (id: string) => void;
}

const StageControls: React.FC<StageControlsProps> = ({ 
  stageId, 
  index, 
  totalStages, 
  onMove, 
  onRemove 
}) => {
  return (
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
        onClick={() => onRemove(stageId)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StageControls;
