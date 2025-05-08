
import React from 'react';

interface EmptyStateProps {
  aiOnlyFilter: boolean;
  itemType: string;
}

const EmptyState = ({ aiOnlyFilter, itemType }: EmptyStateProps) => {
  return (
    <div className="text-center p-4 border border-dashed rounded-md">
      <p className="text-muted-foreground">
        {aiOnlyFilter 
          ? `No AI-generated ${itemType} found. Generate some using the AI Generator tab.` 
          : `No ${itemType} added yet. Add your first ${itemType} above.`
        }
      </p>
    </div>
  );
};

export default EmptyState;
