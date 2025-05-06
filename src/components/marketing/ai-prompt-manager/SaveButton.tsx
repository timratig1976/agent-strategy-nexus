
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SaveButtonProps } from "./types";

export const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, isLoading, onSave }) => {
  return (
    <Button 
      onClick={onSave} 
      disabled={isLoading || isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Prompt"
      )}
    </Button>
  );
};

export default SaveButton;
