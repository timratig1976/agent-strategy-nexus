
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Trash2, ArrowUpDown } from "lucide-react";

interface ItemListControlsProps {
  aiOnlyFilter?: boolean;
  setAiOnlyFilter?: (value: boolean) => void;
  aiGeneratedCount?: number;
  handleDeleteAIGenerated?: () => void;
  isSelectMode: boolean;
  toggleSelectMode: () => void;
  hasItems: boolean;
  sortOrder?: 'default' | 'priority-high' | 'priority-low';
  handleSort?: () => void;
  showAIControls?: boolean;
}

const ItemListControls = ({
  aiOnlyFilter,
  setAiOnlyFilter,
  aiGeneratedCount = 0,
  handleDeleteAIGenerated,
  isSelectMode,
  toggleSelectMode,
  hasItems,
  sortOrder,
  handleSort,
  showAIControls = false
}: ItemListControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {handleSort && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSort}
            className="flex items-center gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortOrder === 'default' ? 'Order' : 
             sortOrder === 'priority-high' ? 'High→Low' : 'Low→High'}
          </Button>
        )}
        
        {/* AI-related buttons have been removed from the default view */}
        {showAIControls && setAiOnlyFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiOnlyFilter(!aiOnlyFilter)}
            className={`flex items-center gap-1 text-xs ${aiOnlyFilter ? 'bg-primary/10' : ''}`}
          >
            <Filter className="h-3 w-3" />
            AI Only
          </Button>
        )}
        
        {showAIControls && aiGeneratedCount > 0 && handleDeleteAIGenerated && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAIGenerated}
            className="flex items-center gap-1 text-xs text-red-500"
          >
            <Trash2 className="h-3 w-3" />
            Clear AI ({aiGeneratedCount})
          </Button>
        )}
      </div>
      
      {hasItems && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSelectMode}
          className="text-xs"
        >
          {isSelectMode ? 'Cancel' : 'Select'}
        </Button>
      )}
    </div>
  );
};

export default ItemListControls;
