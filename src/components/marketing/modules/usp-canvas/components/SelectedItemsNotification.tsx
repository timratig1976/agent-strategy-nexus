
import React from 'react';
import { Button } from "@/components/ui/button";

interface SelectedItemsNotificationProps {
  selectedCount: number;
  handleDeleteSelected: () => void;
  itemLabel: string;
}

const SelectedItemsNotification = ({
  selectedCount,
  handleDeleteSelected,
  itemLabel
}: SelectedItemsNotificationProps) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
      <span className="text-sm">{selectedCount} {itemLabel} selected</span>
      <Button 
        variant="destructive"
        size="sm"
        onClick={handleDeleteSelected}
      >
        Delete Selected
      </Button>
    </div>
  );
};

export default SelectedItemsNotification;
