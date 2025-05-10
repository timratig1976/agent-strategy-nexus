
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FunnelFooterProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

const FunnelFooter: React.FC<FunnelFooterProps> = ({ 
  hasChanges, 
  isSaving, 
  onSave 
}) => {
  return (
    <CardFooter className="flex justify-end">
      <Button onClick={onSave} disabled={!hasChanges || isSaving}>
        {isSaving ? "Saving..." : "Save Funnel Strategy"}
      </Button>
    </CardFooter>
  );
};

export default FunnelFooter;
