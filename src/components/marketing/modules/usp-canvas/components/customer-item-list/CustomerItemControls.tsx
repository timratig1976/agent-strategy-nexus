
import React from 'react';
import ItemListControls from '../ItemListControls';

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
  handleSort
}: CustomerItemControlsProps) => {
  return (
    <ItemListControls 
      aiOnlyFilter={aiOnlyFilter}
      setAiOnlyFilter={setAiOnlyFilter}
      aiGeneratedCount={aiGeneratedCount}
      handleDeleteAIGenerated={handleDeleteAIGenerated}
      isSelectMode={isSelectMode}
      toggleSelectMode={toggleSelectMode}
      hasItems={hasItems}
      sortOrder={sortOrder}
      handleSort={handleSort}
      // Set showAIControls to false to hide AI-related buttons
      showAIControls={false}
    />
  );
};

export default CustomerItemControls;
