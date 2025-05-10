
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus as PlusCircle } from "lucide-react";

interface TouchpointFormProps {
  newTouchpointName: string;
  setNewTouchpointName: (value: string) => void;
  handleAddTouchpoint: () => void;
}

export const TouchpointForm: React.FC<TouchpointFormProps> = ({
  newTouchpointName,
  setNewTouchpointName,
  handleAddTouchpoint
}) => {
  return (
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
  );
};

export default TouchpointForm;
