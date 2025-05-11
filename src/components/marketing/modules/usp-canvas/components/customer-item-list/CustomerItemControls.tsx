
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowDownAZ, 
  ArrowUpZA,
  ArrowDownUp,
  Trash2, 
  CheckSquare, 
  XCircle, 
  Bot
} from "lucide-react";

interface CustomerItemControlsProps {
  aiOnlyFilter: boolean;
  setAiOnlyFilter: (value: boolean) => void;
  aiGeneratedCount: number;
  handleDeleteAIGenerated: () => void;
  isSelectMode: boolean;
  toggleSelectMode: () => void;
  hasItems: boolean;
  sortOrder: 'default' | 'priority-high' | 'priority-low';
  handleSort: () => void;
  showAIControls?: boolean;
}

const CustomerItemControls = ({
  aiOnlyFilter,
  setAiOnlyFilter,
  aiGeneratedCount,
  handleDeleteAIGenerated,
  isSelectMode,
  toggleSelectMode,
  hasItems,
  sortOrder,
  handleSort,
  showAIControls = true
}: CustomerItemControlsProps) => {
  const getSortIcon = () => {
    if (sortOrder === 'default') return <ArrowDownUp className="h-4 w-4 mr-2" />;
    if (sortOrder === 'priority-high') return <ArrowDownAZ className="h-4 w-4 mr-2" />;
    return <ArrowUpZA className="h-4 w-4 mr-2" />;
  };
  
  const getSortTooltip = () => {
    if (sortOrder === 'default') return "Sort by priority";
    if (sortOrder === 'priority-high') return "Sorted high to low";
    return "Sorted low to high";
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center space-x-2">
        {hasItems && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSort}
              title={getSortTooltip()}
            >
              {getSortIcon()}
              Sort
            </Button>
            
            <Button
              variant={isSelectMode ? "secondary" : "outline"}
              size="sm"
              onClick={toggleSelectMode}
            >
              {isSelectMode ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Select
                </>
              )}
            </Button>
          </>
        )}
      </div>
      
      {showAIControls && aiGeneratedCount > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={aiOnlyFilter}
              onCheckedChange={setAiOnlyFilter}
              id="ai-filter"
            />
            <Label htmlFor="ai-filter" className="cursor-pointer">
              <Bot className="h-4 w-4 inline mr-1 text-blue-500" />
              AI Only
            </Label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAIGenerated}
            className="text-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear AI
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerItemControls;
